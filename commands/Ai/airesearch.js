import axios from "axios";

let handler = async (m, { text, usedPrefix, command }) => {
    const input = m.quoted ? m.quoted.text : text;
    if (!input) return m.reply(`Masukkan teks!\n\nContoh:\n${usedPrefix + command} apa itu AI`);

    await m.react('🔎');

    try {
        const url = `https://api.nekolabs.web.id/ai/ai-research?text=${encodeURIComponent(input)}`;
        const response = await axios.get(url);
        const json = response.data;

        if (!json.success || !json.result) {
            await m.react('❌');
            return m.reply("Gagal mengambil data dari AI Research API.");
        }

        await m.react('✅');

        let result = json.result;
        let textRes = `*AI Research Report*\n\n`;
        textRes += `*Query:* ${result.query}\n\n`;
        if (result.subqueries?.length) {
            textRes += `*Subqueries:*\n`;
            for (let sq of result.subqueries) textRes += `- ${sq}\n`;
            textRes += `\n`;
        }
        if (result.report) textRes += result.report;

        m.reply(textRes);
    } catch (e) {
        await m.react('❌');
        m.reply("Terjadi kesalahan saat mengambil data.");
    }
};

handler.help = ["airesearch <text>"];
handler.tags = ["ai"];
handler.command = /^airesearch$/i;
handler.limit = true;

export default handler;