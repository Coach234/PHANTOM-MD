const config = require("../config");
const X = require("../config");
const { pnix, isPrivate, getJson, styletext, listall, sleep, tiny, webp2mp4, toAudio, getBuffer } = require("../lib/");
const { Image } = require("node-webpmux");
const axios = require("axios");



pnix(
  {
    pattern: "sticker",
    fromMe: isPrivate,
    type: "sticker",
  },
  async (message, match, m) => {
    if (!(message.reply_message.video || message.reply_message.image))
      return await message.reply("_Reply To Photo Or Video_");
    let buff = await m.quoted.download();
    message.sendMessage(
      buff,
      { packname: X.STICKER_DATA.split(";")[0],
        author: X.STICKER_DATA.split(";")[1] },
      "sticker"
    );
  }
);

pnix(
  {
    pattern: "attp",
    type: "sticker",
  },
  async (message, match) => {
    try {
      match = match || (message.reply_message && message.reply_message.text);
      if (!match) {
        return await message.reply("_Give Me Some Text_");
      } else {
        const apiEndpoint = `https://api.erdwpe.com/api/maker/attp?text=${encodeURIComponent(match)}`;
        const response = await axios.get(apiEndpoint, { responseType: 'arraybuffer' });

        if (response.status === 200) {
          const stickerBuffer = Buffer.from(response.data, 'binary');
          await message.sendMessage(
            stickerBuffer,
            {
              packname: X.STICKER_DATA.split(";")[0],
              author: X.STICKER_DATA.split(";")[1],
            },
            'sticker'
          );
        } else {
          console.error('_Failed To Fetch Attp Sticker From The Api');
          return await message.reply('_An Error Occured While Changing The Text To Attp Sticker_');
        }
      }
    } catch (error) {
      console.error('_Error While Fetching Attp Sticker:_', error.message);
      return await message.reply('_Error While Fetching Attp Sticker_');
    }
  }
);

pnix(
  {
    pattern: "photo",
    fromMe: isPrivate,
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message)
      return await message.reply("_Reply to a sticker_");
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.reply("_Not a sticker_");
    let buff = await m.quoted.download();
    return await message.sendMessage(buff, {}, "image");
  }
);

pnix(
  {
    pattern: "mp4",
    fromMe: isPrivate,
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message)
      return await message.reply("_Reply to a sticker_");
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.reply("_Not a sticker_");
    let buff = await m.quoted.download();
    let buffer = await webp2mp4(buff);
    return await message.sendMessage(buffer, {}, "video");
  }
);

pnix(
  {
    pattern: "tgs",
    fromMe: isPrivate,
    type: "downloader",
  },
  async (message, match) => {
    if (!match)
      return message.reply(
        "_Enter a tg sticker url_\nEg: https://t.me/addstickers/Oldboyfinal\nKeep in mind that there is a chance of ban if used frequently"
      );
    let packid = match.split("/addstickers/")[1];
    let { result } = await getJson(
      `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(
        packid
      )}`
    );
    if (result.is_animated)
      return message.reply("_Animated stickers are not supported_");
    message.reply(
      `*Total stickers :* ${result.stickers.length}\n*Estimated complete in:* ${
        result.stickers.length * 1.5
      } seconds`.trim()
    );
    for (let sticker of result.stickers) {
      let file_path = await getJson(
        `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${sticker.file_id}`
      );
      await message.sendMessage(
        `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${file_path.result.file_path}`,
        { packname: X.STICKER_DATA.split(";")[0], author: X.STICKER_DATA.split(";")[1] },
        "sticker"
      );
      sleep(1500);
    }
  }
);

pnix(
  {
    pattern: "take",
    fromMe: isPrivate,
    type: "sticker",
  },
  async (message, match, m) => {
    if (!message.reply_message && !message.reply_message.sticker)
      return await message.reply("_Reply to sticker_");
    let buff = await m.quoted.download();
    let [packname, author] = match.split(",");
    await message.sendMessage(
      buff,
      {
        packname: packname || X.STICKER_DATA.split(";")[0],
        author: author || X.STICKER_DATA.split(";")[1],
      },
      "sticker"
    );
  }
);



pnix(
  {
    pattern: "getexif",
    fromMe: isPrivate,
    type: "sticker",
  },
  async (message, match, m) => {
    if (!message.reply_message || !message.reply_message.sticker)
      return await message.reply("_Reply to sticker_");
    let img = new Image();
    await img.load(await m.quoted.download());
    const exif = JSON.parse(img.exif.slice(22).toString());
    await message.reply(exif);
  }
);

//fancy

pnix(
  {
    pattern: "fancy",
    fromMe: isPrivate,
    type: "tools",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.text || !match ||isNaN(match)) {
      let text = tiny(
        "Fancy text generator\n\nReply to a message\nExample: .fancy 32\n\n"
      );
      listall("Fancy").forEach((txt, num) => {
        text += `${(num += 1)} ${txt}\n`;
      });
      return await message.reply(text);
    } else {
      message.reply(styletext(message.reply_message.text, parseInt(match)));
    }
  }
);
