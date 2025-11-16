import axios from "axios";

let handler = async (m, { text, usedPrefix, command }) => {
    const input = m.quoted ? m.quoted.text : text;
    if (!input) return m.reply(`Masukkan pertanyaan!\n\nContoh:\n${usedPrefix + command} apa itu AI`);

    await m.react('🔎');

    try {
        const url = `https://api.nekolabs.web.id/ai/copilot?text=${encodeURIComponent(input)}`;
        const response = await axios.get(url);
        let json = response.data;

        if (!json.success) {
            await m.react('❌');
            return m.reply("Gagal mendapatkan respon dari API.");
        }

        await m.react('✅');
        m.reply(json.result.text);
    } catch (err) {
        await m.react('❌');
        m.reply("Terjadi kesalahan saat menghubungi API.");
    }
};

handler.help = ["copilot"];
handler.tags = ["ai"];
handler.command = /^copilot$/i;
handler.register = true;
handler.limit = true;

export default handler;