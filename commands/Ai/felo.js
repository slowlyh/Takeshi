import axios from "axios";

let handler = async (m, { text, usedPrefix, command }) => {
    const input = m.quoted ? m.quoted.text : text;
    if (!input) return m.reply(`Masukkan teks!\n\nContoh:\n${usedPrefix + command} apa itu golang`);

    await m.react('🔎');

    try {
        const url = `https://api.nekolabs.web.id/ai/feloai?text=${encodeURIComponent(input)}`;
        const response = await axios.get(url);
        const json = response.data;

        if (!json.success || !json.result) {
            await m.react('❌');
            return m.reply("Gagal mengambil data dari Felo AI API.");
        }

        await m.react('✅');

        let r = json.result;
        let out = `*Felo AI*\n\n`;
        if (r.text) out += r.text + `\n\n`;
        if (r.sources?.length) {
            out += `*Sources:*\n`;
            for (let src of r.sources) {
                out += `- ${src.title}\n`;
            }
        }

        m.reply(out.trim());
    } catch (e) {
        await m.react('❌');
        m.reply("Terjadi kesalahan saat mengambil data.");
    }
};

handler.help = ["felo <text>"];
handler.tags = ["ai"];
handler.command = /^felo|feloai$/i;
handler.limit = true;

export default handler;