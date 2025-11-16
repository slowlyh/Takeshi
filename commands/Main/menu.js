import os from "os";
import util from "util";

let handler = async (m, { conn, usedPrefix, __dirname }) => {
	try {
		// Ambil prefix otomatis
		let prefix =
			(typeof usedPrefix !== "undefined" ? usedPrefix : global.prefix) ||
			"/";

		// Ambil semua plugins
		let plugin = Object.values(global.plugins);

		// Menyusun tags otomatis berdasarkan handler.tags
		let tags = {};
		plugin.forEach((plugin) => {
			if (plugin?.help && plugin?.tags) {
				plugin.tags.forEach((tag) => {
					if (!tags[tag]) tags[tag] = [];
					tags[tag].push(...plugin.help);
				});
			}
		});

		// Susun daftar menu
		let menuList = "";
		for (let tag in tags) {
			menuList += `\n– *${tag.toUpperCase()}*\n`;
			for (let cmd of tags[tag]) {
				menuList += `  › ${prefix}${cmd}\n`;
			}
		}

		// Database size
		let dbSize = (JSON.stringify(global.db).length / 1024).toFixed(2);

		// Teks utama
		let teksMenu = `
Oh hi @${m.sender.split("@")[0]}...  

Good Night!  
I am an automated system (WhatsApp Bot) that can help  
to do something, search and get data / information only  
through WhatsApp.

• Database : Local • ${dbSize} KB  
• Library : npm:@baileys@7.0.0-rc.6 
• Rest API : https://api.hyuu.tech 
• Source : https://github.com/slowlyh/takeshi

─── >>  *LIST MENU*  << ───  
${menuList}
    `.trim();

		return conn.sendMessage(
			m.chat,
			{
				text: teksMenu,
				mentions: [m.sender],
				contextInfo: {
					externalAdReply: {
						title: "Takeshi - by Slowlyh~",
						body: "",
						thumbnailUrl: "https://files.catbox.moe/k7u3yl.jpeg", // isi URL thumbnail jika ada
						sourceUrl: "https://github.com/slowlyh/takeshi", // bisa diisi link IG/YouTube
						mediaType: 1,
						renderLargerThumbnail: true,
					},
				},
			},
			{ quoted: m }
		);
	} catch (e) {
		console.error(e);
		return m.reply("Terjadi kesalahan saat menampilkan menu.");
	}
};

handler.help = ["menu"];
handler.tags = ["main"];
handler.command = ["menu", "help", "?"];

export default handler;
