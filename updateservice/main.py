import requests
from tqdm import tqdm
from packaging import version
import json
import os
import sys
import zipfile
import subprocess
import psutil
import time
import traceback
import ctypes

def extract_zip(zip_file_path, extract_to_path=None):
	if extract_to_path is None:
		# Extract to the same directory as the ZIP file
		extract_to_path = os.path.dirname(zip_file_path)
	
	# Make sure the extraction directory exists
	os.makedirs(extract_to_path, exist_ok=True)
	
	# Open and extract the ZIP file
	with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
		zip_ref.extractall(extract_to_path)
	
	print(f"Extracted {zip_file_path} to {extract_to_path}")


def download_file(url, filename=None):
	# Get filename from URL if not provided
	if filename is None:
		filename = os.path.basename(url)
	
	# Make HTTP request with stream=True to download in chunks
	response = requests.get(url, stream=True)
	response.raise_for_status()  # Raise an exception for HTTP errors
	
	# Get file size from headers (if available)
	total_size = int(response.headers.get('content-length', 0))
	
	# Initialize progress bar
	progress_bar = tqdm(
		total=total_size,
		unit='B',
		unit_scale=True,
		desc=filename
	)
	
	# Write the file in chunks and update the progress bar
	with open(filename, 'wb') as file:
		for chunk in response.iter_content(chunk_size=1024):
			if chunk:  # filter out keep-alive chunks
				file.write(chunk)
				progress_bar.update(len(chunk))
	
	progress_bar.close()
	return filename

def get_listing(config):
	provider_url = config["update_provider_url"]
	print("Getting versions listing")
	listing_req = requests.get(provider_url + "versions.json")
	listing_req.raise_for_status()
	listing = listing_req.json()
	return listing

def get_update(config, listing):
	local_ver = None
	with open("version.json", "r") as f:
		local_ver = json.load(f)["version"] or "0"

	if not "latest" in listing:
		return

	latest = listing["latest"]

	if (version.parse(latest["version"]) > version.parse(local_ver)):
		path = latest["full"]
		delta = latest.get("delta", {}).get(local_ver, "")
		if delta != "" and not config.get("nodelta", False):
			path = delta

		return (latest["version"], config["update_provider_url"] + path)

def load_config():
	config = None
	with open("updateconfig.json", "r") as f:
		config = json.load(f)
	return config

def cmd_check():
	config = load_config()
	listing = get_listing(config)

	update = get_update(config, listing)
	if update is None:
		print("No update found")
		sys.exit(1)
		return

	version, download_url = update

	print(f"Update found {version} {download_url}")
	sys.exit(0)
	return


def launch_detached(executable, args):
	if "--nolaunch" in sys.argv:
		print(executable, args)
		input()
		sys.exit(0)
		return

	this_pid = os.getpid()
	subprocess.Popen([executable, f"--wait={this_pid}"] + args, creationflags=subprocess.DETACHED_PROCESS)

def wait_for_parent():
	wa = list(filter(lambda a: "--wait" in a, sys.argv))
	if len(wa) == 0:
		return
	
	ppid = int(wa[0].split("=")[1])

	print(f"Waiting for PID {ppid}")

	try:
		while True:
			process = psutil.Process(ppid)
			time.sleep(0.1)
	except psutil.NoSuchProcess:
		return

def cmd_update():
	config = load_config()
	listing = get_listing(config)

	update = get_update(config, listing)
	if update is None:
		print("No update found")
		sys.exit(1)
		return

	version, download_url = update

	print("Downloading", download_url)
	download_file(download_url, "update.zip")
	print("Update downloaded successfully")
	print("Extracting update.zip")
	extract_zip("update.zip", "tmp_update")

	if os.path.isfile("tmp_update/update.exe"):
		launch_detached("tmp_update/update.exe", ["--stage2"])
		time.sleep(0.5)
		return
	
	cmd_stage2(False)

def cmd_stage2(detach = True):
	print("Stage2: replacing files")
	ps_commands = [
		"Copy-Item -Path tmp_update/* -Destination . -Recurse -Force"
	]

	for cmd in ps_commands:
		subprocess.run(["powershell", "-Command", cmd], check=True)

	if detach:
		launch_detached("./update.exe", ["--stage3"])
		time.sleep(0.5)
		return

	cmd_stage3()


def cmd_stage3():
	print("Stage3: removing temporary files")
	ps_commands = [
		"Remove-Item -Recurse -Force -Path tmp_update, update.zip"
	]

	for cmd in ps_commands:
		subprocess.run(["powershell", "-Command", cmd], check=True)

	print("Update finished")

	ctypes.windll.user32.MessageBoxW(0, "Update completed, you can now start the application!", "Update complete", 0x40)

def main():
	try:
		wait_for_parent()
		if "--check" in sys.argv:
			cmd_check()
		elif "--stage2" in sys.argv:
			cmd_stage2()
		elif "--stage3" in sys.argv:
			cmd_stage3()
		else:
			cmd_update()
	except Exception as e:
		traceback.print_exc()
		input()

if __name__ == "__main__":
	main()
