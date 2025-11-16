import { promises } from "fs";
import path from "path";
import syntaxError from "syntax-error";
import { fileURLToPath } from "url";

let handler = async (m, { text, command }) => {
	if (!text) return m.reply(".sfp Owner/tes.js");
	if (!m.quoted) throw `Balas/quote media/text yang ingin disimpan`;

	const codeText = m.quoted.text;

	// FIX: __root tidak boleh salah lagi
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	// Cari folder root (yang punya folder commands)
	const __root = path.join(__dirname, "../../");
	const pluginsDir = path.join(__root, "commands");

	let autoCJS = false;
	if (
		codeText.includes("module.exports") ||
		codeText.includes("require(") ||
		codeText.includes("exports.")
	) {
		autoCJS = true;
	}

	const ext = autoCJS ? ".cjs" : ".js";

	// === SAVE PLUGIN ===
	if (/p(lugin)?/i.test(command)) {
		let filename = text.replace(/plugin(s)?\//i, "");
		if (!/(\.js|\.cjs)$/i.test(filename)) filename += ext;

		const error = syntaxError(codeText, filename, {
			sourceType: "module",
			allowReturnOutsideFunction: true,
			allowAwaitOutsideFunction: true,
		});
		if (error) throw error;

		// FIX: langsung ke commands/Owner/file.js
		const dst = path.join(pluginsDir, filename);

		await promises.mkdir(path.dirname(dst), { recursive: true });
		await promises.writeFile(dst, codeText);

		return m.reply(`Berhasil disimpan ke commands/${filename}`);
	}

	// === SAVE FILE BIASA ===
	let filePath = path.join(__root, text);

	if (!/(\.js|\.cjs)$/i.test(filePath) && !m.quoted.mediaMessage) {
		filePath += ext;
	}

	await promises.mkdir(path.dirname(filePath), { recursive: true });
	await promises.writeFile(filePath, codeText);

	return m.reply(`Successfully saved to *${text}*`);
};

handler.help = ["sfp <folder/file>"];
handler.tags = ["owner"];
handler.command = /^(sfp|saveplugin)$/i;
handler.owner = true;

export default handler;
