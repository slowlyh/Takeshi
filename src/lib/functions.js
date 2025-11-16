import axios from "axios";
import { toBuffer } from "baileys";
import { fileTypeFromBuffer } from "file-type";
import { promises } from "fs";
import { join } from "path";

const reBoldItalic = /\*\*\*(.+?)\*\*\*/g;
const reBold = /\*\*(.+?)\*\*/g;
const reItalic = /\*(.+?)\*/g;
const reStrike = /~~(.+?)~~/g;
const reMono = /```[\w]*\n([\s\S]+?)\n```/g;

const BOLD_ITALIC_START = "#{BI}";
const BOLD_ITALIC_END = "#{BE}";
const BOLD = "#{BB}";
const ITALIC = "#{II}";

class Func {
	/** CEK URL **/
	isUrl(url) {
		const pattern =
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/gi;
		return pattern.test(url);
	}

	/** FORMAT MARKDOWN **/
	formatMD(s) {
		if (!s || typeof s !== "string") return s;
		s = s.replace(reBoldItalic, `${BOLD_ITALIC_START}$1${BOLD_ITALIC_END}`);
		s = s.replace(reBold, `${BOLD}$1${BOLD}`);
		s = s.replace(reItalic, `${ITALIC}$1${ITALIC}`);
		s = s.replace(reStrike, `~$1~`);

		s = s.replace(new RegExp(BOLD_ITALIC_START, "g"), "_*");
		s = s.replace(new RegExp(BOLD_ITALIC_END, "g"), "*_");
		s = s.replace(new RegExp(BOLD, "g"), "*");
		s = s.replace(new RegExp(ITALIC, "g"), "_");

		s = s.replace(reMono, "```$1```");
		return s;
	}

	/** RANDOM **/
	pickRandom(list) {
		return list[Math.floor(Math.random() * list.length)];
	}

	randomInt(min, max) {
		const ceilMin = Math.ceil(min);
		const floorMax = Math.floor(max);
		return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
	}

	/** RUNTIME FORMAT **/
	runtime(seconds) {
		const d = Math.floor(seconds / (3600 * 24));
		const h = Math.floor((seconds % (3600 * 24)) / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = Math.floor(seconds % 60);

		const dDisplay = d > 0 ? `${d} day${d === 1 ? "" : "s"}, ` : "";
		const hDisplay = h > 0 ? `${h} hour${h === 1 ? "" : "s"}, ` : "";
		const mDisplay = m > 0 ? `${m} minute${m === 1 ? "" : "s"}, ` : "";
		const sDisplay = `${s} second${s === 1 ? "" : "s"}`;

		return dDisplay + hDisplay + mDisplay + sDisplay;
	}

	/** TIME AGO **/
	ago(time) {
		const ts = new Date(time).getTime();
		const now = Date.now();
		const diff = Math.floor((now - ts) / 1000);

		if (diff < 60) return `${diff} detik yang lalu`;
		const m = Math.floor(diff / 60);
		if (m < 60) return `${m} menit yang lalu`;
		const h = Math.floor(diff / 3600);
		if (h < 24) return `${h} jam yang lalu`;
		const d = Math.floor(diff / 86400);
		if (d < 30) return `${d} hari yang lalu`;
		const mn = Math.floor(diff / 2592000);
		if (mn < 12) return `${mn} bulan yang lalu`;
		const y = Math.floor(diff / 31536000);
		return `${y} tahun yang lalu`;
	}

	/** FETCH JSON **/
	async fetchJson(url, options = {}) {
		const res = await axios.get(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
			},
			...options,
		});
		return res.data;
	}

	/** FETCH BUFFER (STREAM) **/
	async fetchBuffer(url, options = {}) {
		const response = await axios.request({
			method: options.method || "get",
			url,
			headers: {
				Accept: "*/*",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
				...(options.headers || {}),
			},
			responseType: "arraybuffer",
			data: options.data || null,
			...options,
		});

		const buffer = Buffer.from(response.data);
		const filetype = await fileTypeFromBuffer(buffer);

		return {
			data: buffer,
			filename: null,
			mimetype: filetype?.mime || "application/octet-stream",
			ext: filetype?.ext || "bin",
		};
	}

	/** SIMPAN FILE JIKA PERLU **/
	async getFile(PATH, save) {
		const data = await this.fetchBuffer(PATH);
		let filename = null;

		if (data?.data && save) {
			filename = join(process.cwd(), "temp", `${Date.now()}.${data.ext}`);
			await promises.writeFile(filename, data.data);
		}

		return {
			filename: filename,
			...data,
		};
	}

	/** FETCH BUFFER PLAIN **/
	async getBuffer(url, options = {}) {
		const res = await axios.get(url, {
			headers: {
				DNT: 1,
				"Upgrade-Insecure-Request": 1,
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
			},
			responseType: "arraybuffer",
			...options,
		});
		return res.data;
	}

	/** YANG BELUM ADA —> AKU TAMBAHKAN DI BAWAH **/

	/** FORMAT SIZE BYTES **/
	getSize(size) {
		const units = ["B", "KB", "MB", "GB", "TB"];
		let i = 0;
		while (size > 1024 && i < units.length - 1) {
			size /= 1024;
			i++;
		}
		return `${size.toFixed(2)} ${units[i]}`;
	}

	/** GREETING OTOMATIS **/
	greeting() {
		const hour = new Date().getHours();
		if (hour < 4) return "Selamat dini hari";
		if (hour < 11) return "Selamat pagi";
		if (hour < 15) return "Selamat siang";
		if (hour < 18) return "Selamat sore";
		return "Selamat malam";
	}

	/** UPPERCASE HURUF PERTAMA TIAP KATA **/
	ucword(str) {
		return str.replace(/\b[a-z]/g, (c) => c.toUpperCase());
	}
}

export default new Func();
