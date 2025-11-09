let handler = async (m, { args, groupMetadata }) => {
	m.reply(
		"Berhasil Reset linkgc\n\n Link : https://chat.whatsapp.com/" +
			(await conn.groupRevokeInvite(m.chat))
	);
};
handler.help = ["revoke"];
handler.tags = ["group"];
handler.command = /^(revoke)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
