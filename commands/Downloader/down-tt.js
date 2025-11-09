import axios from "axios";

let handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `Gunakan: ${usedPrefix + command} <Link TikTok>`;

	let loading = m.react("⏱️");

	try {
		const apiUrl = "https://api.nekolabs.web.id/downloader/tiktok";
		const { data } = await axios.get(
			`${apiUrl}?url=${encodeURIComponent(text)}`
		);

		if (!data.success || !data.result) {
			throw new Error("Gagal mendapatkan data TikTok.");
		}

		const { result } = data;

		const caption = `
*TikTok Downloader*

*Judul:* ${result.title}
*Musik:* ${result.music_info?.title || "N/A"} (${result.music_info?.author || "N/A"})
*Author:* ${result.author?.username || "N/A"}
*Views:* ${result.stats?.play || "N/A"}
*Likes:* ${result.stats?.like || "N/A"}
*Shared:* ${result.stats?.share || "N/A"}
        `.trim();

		if (result.images && result.images.length > 0) {
			await m.reply(
				`*Ditemukan ${result.images.length} gambar.* Mengirimkan...`
			);

			for (let i = 0; i < result.images.length; i++) {
				const imageUrl = result.images[i];
				await m.reply({
					image: { url: imageUrl },
					caption: i === 0 ? caption : "",
				});
			}
		} else if (result.videoUrl) {
			await m.reply({
				video: { url: result.videoUrl },
				caption: caption,
			});
		} else {
			throw new Error(
				"Tautan video atau gambar tidak ditemukan dalam respons API."
			);
		}

		m.react("✅");
	} catch (e) {
		m.reply(e.message);
		m.react("❌");
	}
};
handler.help = ["tiktok"];
handler.tags = ["downloader"];
handler.command = /^(tt|tiktok|ttdl|ttslide)$/i;
handler.limit = true;

export default handler;
