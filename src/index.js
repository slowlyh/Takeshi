import cluster from "cluster";
import { unwatchFile, watchFile } from "fs";
import { createRequire } from "module";
import { dirname, join, resolve } from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

const { fork, setupMaster } = cluster;

console.log("🐾 Starting...");

// https://stackoverflow.com/a/50052194
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname); // Bring in the ability to create the 'require' method
global.rootPath = resolve(__dirname, "..");
const { name, author } = require(join(__dirname, "../package.json")); // https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
const rl = createInterface(process.stdin, process.stdout);

var isRunning = false;
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
	if (isRunning) return;
	isRunning = true;
	let args = [join(__dirname, file), ...process.argv.slice(2)];
	cluster.setupMaster({
		exec: args[0],
		args: args.slice(1),
	});
	let p = cluster.fork();
	p.on("message", (data) => {
		console.log("[RECEIVED]", data);
		switch (data) {
			case "reset":
				p.process.kill();
				isRunning = false;
				start.apply(this, arguments);
				break;
			case "uptime":
				p.send(process.uptime());
				break;
		}
	});
	p.on("exit", (_, code) => {
		isRunning = false;
		console.error("[❗] Exited with code:", code);
		if (code === 0) return;
		watchFile(args[0], () => {
			unwatchFile(args[0]);
			start(file);
		});
	});
	if (!rl.listenerCount())
		rl.on("line", (line) => {
			p.emit("message", line.trim());
		});
	// console.log(p)
}

start("core/main.js");
