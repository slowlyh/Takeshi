import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let handler = async (m, { args }) => {
    if (!args[0]) return m.reply("❗ Contoh:\n.gp Info/tes\n.gp ping");

    const target = args[0].toLowerCase();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const root = path.resolve(__dirname, "../../");
    const commandsDir = path.join(root, "commands");

    // ==============
    // PRIORITAS #1: CARI FILE LANGSUNG
    // ==============
    const jsPath = path.join(commandsDir, target + ".js");
    const cjsPath = path.join(commandsDir, target + ".cjs");

    if (fs.existsSync(jsPath)) {
        const content = fs.readFileSync(jsPath, "utf8");
        return m.reply("```js\n" + content + "\n```");
    }
    if (fs.existsSync(cjsPath)) {
        const content = fs.readFileSync(cjsPath, "utf8");
        return m.reply("```js\n" + content + "\n```");
    }

    // ==============
    // PRIORITAS #2: CARI BERDASARKAN COMMAND
    // ==============
    let found = null;

    const isBadRegex = (regex) => {
        const s = regex.toString();
        return (
            s === "/(?:)/" || // match semua
            s === "/(?=)/" ||
            s === "/.*/" ||
            s === "//" ||
            s === "/^.*$/"
        );
    };

    function scan(dir) {
        const files = fs.readdirSync(dir);

        for (const f of files) {
            const full = path.join(dir, f);

            if (fs.statSync(full).isDirectory()) {
                scan(full);
                continue;
            }

            if (!f.endsWith(".js") && !f.endsWith(".cjs")) continue;

            const content = fs.readFileSync(full, "utf8");

            if (!content.includes("handler.command")) continue;

            // Ambil customPrefix dulu (harus di-skip)
            if (/handler\.customPrefix\s*=/.test(content)) continue;

            const match = content.match(/handler\.command\s*=\s*(.+)/);
            if (!match) continue;

            let cmdValue;
            try {
                cmdValue = eval(match[1]);
            } catch {
                continue;
            }

            // ---- ARRAY COMMAND ----
            if (Array.isArray(cmdValue)) {
                if (cmdValue.map(v => v.toString().toLowerCase()).includes(target)) {
                    found = full;
                }
                continue;
            }

            // ---- REGEXP COMMAND ----
            if (cmdValue instanceof RegExp) {

                if (isBadRegex(cmdValue)) continue; // skip regex sampah

                if (cmdValue.test(target)) {
                    found = full;
                }

                continue;
            }
        }
    }

    scan(commandsDir);

    if (!found) return m.reply(`❌ Plugin tidak ditemukan untuk: *${args[0]}*`);

    const content = fs.readFileSync(found, "utf8");
    return m.reply(content);
};

handler.help = ["gp <path|command>"];
handler.tags = ["owner"];
handler.command = ["gp"];
handler.owner = true;

export default handler;