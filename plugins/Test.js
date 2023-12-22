const { pnix, isPrivate } = require("../lib/");
const got = require("got");

const mp3Url = "https://raw.githubusercontent.com/AbhishekSuresh2/Phoenix-MD/main/media/mp3/pnix.mp3";

pnix({
    pattern: 'alive',
    fromMe: isPrivate,
    type: "main",
}, async (message, match) => {
    const sourceUrl = 'https://github.com/AbhishekSuresh2/Phoenix-MD';

    const linkPreview = {
        title: "I M Alive Now",
        body: "𝙿𝚑𝚘𝚎𝚗𝚒𝚡-𝙼𝙳",
        thumbnail: "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg",
        mediaType: 1,
        mediaUrl: sourceUrl,
        sourceUrl: sourceUrl,
        showAdAttribution: false,
        renderLargerThumbnail: false
    };

    const response = await got.stream(mp3Url);
    await message.client.sendMessage(message.jid, { audio: response, contextInfo: { externalAdReply: linkPreview } }, { quoted: message.quoted || '' });
});
