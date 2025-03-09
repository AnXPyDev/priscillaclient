import { spawn } from "child_process";

export default function updateRoutine() {
	const check = spawn("./update.exe", ["--check"], {
		windowsHide: true
	});

	check.on("close", (code) => {
		if (code == 0) {
			const update = spawn("./update.exe", [`--wait=${process.pid}`], {
				detached: true
			});

			update.unref()

			process.exit(0)
		}
	});
}
