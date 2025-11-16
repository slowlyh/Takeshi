import archiver from "archiver";
import fs from "fs";

/* ===============================
   Utility Fungsi (Func)
================================== */

const Func = {
	/**
	 * Konversi byte ke ukuran human readable
	 */
	toSize(bytes) {
		if (isNaN(bytes)) return "0 B";
		const units = ["B", "KB", "MB", "GB", "TB", "PB"];
		let i = 0;

		while (bytes >= 1024 && i < units.length - 1) {
			bytes /= 1024;
			i++;
		}

		return bytes.toFixed(2) + " " + units[i];
	},
};

let handler = async (m, { conn, isOwner }) => {
	if (global.conn.user.jid !== conn.user.jid) return;

	await m.react("🔓");

	let backupPath = "tmp/Takeshi.zip";

	// Pastikan folder tmp ada
	if (!fs.existsSync("tmp")) fs.mkdirSync("tmp");

	const output = fs.createWriteStream(backupPath);
	const archive = archiver("zip", { zlib: { level: 9 } });

	output.on("close", async () => {
		let cap =
			"Proses pengarsipan selesai.\nUkuran: " +
			Func.toSize(archive.pointer());

		console.log(cap);

		await conn.sendFile(
			global.owner.map(([number]) => number) + "@s.whatsapp.net",
			backupPath,
			"Takeshi.zip",
			cap,
			m
		);

		await m.react("🔐");

		setTimeout(() => {
			if (fs.existsSync(backupPath)) fs.unlinkSync(backupPath);
		}, 30000);
	});

	archive.on("warning", (err) => {
		if (err.code === "ENOENT") console.warn(err);
		else throw err;
	});

	archive.on("error", (err) => {
		throw err;
	});

	archive.pipe(output);

	archive.glob("**/*", {
		ignore: ["node_modules/**", "tmp/**", "sessions/**"],
	});

	archive.finalize();
};

handler.help = ["backup"];
handler.tags = ["owner"];
handler.command = /^backup$/i;
handler.owner = true;

export default handler;
