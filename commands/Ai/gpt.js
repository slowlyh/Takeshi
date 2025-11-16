import axios from "axios";

let handler = async (m, { text, usedPrefix, command }) => {
    const input = m.quoted ? m.quoted.text : text;
    if (!input) return m.reply(`Masukkan pertanyaan!\n\nContoh:\n${usedPrefix + command} apa itu AI`);

    await m.react('🔎');

let system = "You are a friendly and joking assistant, use Indonesian when responding."

    try {
        const url = `https://api.nekolabs.web.id/ai/gpt/5?text=${encodeURIComponent(input)}&systemPrompt=${system}`;
        const response = await axios.get(url);
        let json = response.data;

        if (!json.success) {
            await m.react('❌');
            return m.reply("Gagal mendapatkan respon dari API.");
        }

        await m.react('✅');
        m.reply(json.result);
    } catch (err) {
        await m.react('❌');
        m.reply("Terjadi kesalahan saat menghubungi API.");
    }
};

handler.help = ["gpt"];
handler.tags = ["ai"];
handler.command = /^gpt$/i;
handler.register = true;
handler.limit = true;

export default handler;