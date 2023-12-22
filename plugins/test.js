const { pnix, isPrivate, getBuffer } = require("../lib/");
const image = "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg";
const thumb = "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg";
const mp3Url = "https://raw.githubusercontent.com/AbhishekSuresh2/Phoenix-MD/main/mp3/media/pnix.mp3";

pnix({
    pattern: 'alive',
    fromMe: isPrivate,
}, async (message, match) => {
    const logo = await getBuffer(image);
    const thumbnail = await getBuffer(thumb);
    const abhi = await getBuffer(mp3Url);
    const sourceUrl = 'https://github.com/AbhishekSuresh2/Phoenix-MD';

    const linkPreview = {
        title: "I M Alive Now",
        body: "𝙿𝚑𝚘𝚎𝚗𝚒𝚡-𝙼𝙳",
        thumbnail: logo,
        mediaType: 1,
        mediaUrl: sourceUrl,
        sourceUrl: sourceUrl,
        showAdAttribution: false,
        renderLargerThumbnail: false
    };

    await message.client.sendMessage(message.jid, { audio: abhi, contextInfo: { externalAdReply: linkPreview } }, { quoted: message.quoted || '' });
});
