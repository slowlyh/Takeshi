import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

let handler = async (m, { args }) => {
	if (!args[0]) return m.reply("❗ Contoh: .dfp Owner/tes.js");

	const filename = args[0];

	// Ambil posisi file handler
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	// Root utama project
	const __root = path.join(__dirname, "../../");

	// Folder commands utama
	const pluginsDir = path.join(__root, "commands");

	// Lokasi file yang akan dihapus
	const targetPath = path.join(pluginsDir, filename + '.js');

	try {
		// Cek kalau file ada
		await fs.access(targetPath).catch(() => {
			throw new Error(`❌ File tidak ditemukan: commands/${filename}`);
		});

		// Hapus file
		await fs.unlink(targetPath);

		m.reply(`✅ Berhasil menghapus file *commands/${filename}*`);
	} catch (err) {
		m.reply(`❌ Error:\n${err.message}`);
	}
};

handler.help = ["dfp <folder/file.js>"];
handler.tags = ["owner"];
handler.command = /^dfp$/i;
handler.owner = true;

export default handler;