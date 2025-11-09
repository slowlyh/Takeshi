import chalk from "chalk";
import { unwatchFile, watchFile } from "fs";
import { fileURLToPath } from "url";

// --- KONFIGURASI BOT ---
global.pairingNumber = "6283836745241";
global.owner = [["62895622412769", "Slowly", true]];
global.mods = ["62895622412769"];

// --- KONFIGURASI BOT ---
global.namebot = "Takeshi";
global.author = "Slowly";

// --- KONFIGURASI STICKER ---
global.stickpack = "Creted By";
global.stickauth = global.namebot;

// --- KONFIGURASI GAME/LEVEL ---
global.multiplier = 38; // Semakin tinggi, semakin sulit naik level

/*============== EMOJI RPG ==============*/
global.rpg = {
	emoticon(string) {
		string = string.toLowerCase();
		let emot = {
			level: "📊",
			limit: "🎫",
			health: "❤️",
			stamina: "🔋",
			exp: "✨",
			money: "💹",
			bank: "🏦",
			potion: "🥤",
			diamond: "💎",
			common: "📦",
			uncommon: "🛍️",
			mythic: "🎁",
			legendary: "🗃️",
			superior: "💼",
			pet: "🔖",
			trash: "🗑",
			armor: "🥼",
			sword: "⚔️",
			pickaxe: "⛏️",
			fishingrod: "🎣",
			wood: "🪵",
			rock: "🪨",
			string: "🕸️",
			horse: "🐴",
			cat: "🐱",
			dog: "🐶",
			fox: "🦊",
			petFood: "🍖",
			iron: "⛓️",
			gold: "🪙",
			emerald: "❇️",
			upgrader: "🧰",
		};
		let results = Object.keys(emot)
			.map((v) => [v, new RegExp(v, "gi")])
			.filter((v) => v[1].test(string));
		if (!results.length) return "";
		else return emot[results[0][0]];
	},
};

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
	unwatchFile(file);
	console.log(chalk.redBright("Update 'config.js'"));
	import(`${file}?update=${Date.now()}`);
});
