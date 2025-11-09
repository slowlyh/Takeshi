import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let handler = (m) => m;
handler.all = async function (m, { __dirname }) {
	if (typeof __dirname === "undefined") {
		const __filename = fileURLToPath(import.meta.url);
		__dirname = path.dirname(__filename);
	}

	const mediaPath = path.resolve(__dirname, "../src/media/thumbnail.jpg");

	global.thumbnail = "https://files.catbox.moe/bv507p.jpeg";

	global.pathResolve = (pathh) => path.resolve(__dirname, "..", pathh);
};

export default handler;
