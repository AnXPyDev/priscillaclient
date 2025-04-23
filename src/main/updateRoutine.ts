import { spawn } from "child_process";
import { existsSync } from "fs";

export default async function updateRoutine() {
	const update_exe = "./update.exe";

	if (!existsSync(update_exe)) {
		return;
	}

	const check = spawn(update_exe, ["--check"], {
		windowsHide: true
	});

	const res = await new Promise((resolve) => {
		check.on("close", (code) => {
			if (code == 0) {
				resolve(true)
				return;
			}
			resolve(false);
		})
	})

	if (res !== true) {
		return;
	}

	const update = spawn('cmd.exe', ['/c', 'start', '', update_exe, `--wait=${process.pid}`], {
		detached: true,
		stdio: 'ignore',
		windowsHide: false
	});

	update.unref()

	process.exit(0)
}
