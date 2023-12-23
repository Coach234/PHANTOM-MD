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
    fromMe: isPrivate,
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
      return await message.reply("_Reply To A Sticker_");
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.reply("_Not A Sticker_");
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
      return await message.reply("_Reply To A Sticker_");
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.reply("_Not A Sticker_");
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
  async (message, match, m) => {
    if (!match)
      return message.reply(
        "_Enter A Telegram Sticker Url_\n📌 Example : tgs https://t.me/addstickers/Oldboyfinal"
      );
    let packid = match.split("/addstickers/")[1];
    let { result } = await getJson(
      `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(
        packid
      )}`
    );
    if (result.is_animated)
      return message.reply("_Animated Stickers Are Not Supported_");
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
      return await message.reply("_Reply To A Sticker_");
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
      return await message.reply("_Reply To A Sticker_");
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
  async (message, match, m) => {
    if (!message.reply_message || !message.reply_message.text || !match ||isNaN(match)) {
      let text = tiny(
        "Fancy Text Generator\n\nReply To A Message\n📌 Example : fancy 26\n\n"
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

function _0x3c7c(){const _0x46768d=['20934RxoDiv','*Result\x20Not\x20Found*','46856821OnIFTo','249416aqIyLB','156dkscli','976700aNvPXg','trim','812722jWFbjM','153775QiZIPB','_Enter\x20A\x20Country\x20Name/County\x20Code_\x0a_📌\x20Example\x20:\x20*','timeZone','push','250EDdJtB','https://levanter.onrender.com/time?code=','297621lQPMsJ','shift','8JLDnAN','10acRwXs','12xuwWVZ','../lib','8954yiwbPw','time\x20?(.*)','36kEIhsE','8248198MkVeeD','4626126zdtENt','11485208NKZwzL','2662090KISQTI','1071776Skhjmf','reply','1802480rFPjGN','\x0a*TimeZone:*\x20'];_0x3c7c=function(){return _0x46768d;};return _0x3c7c();}function _0x14f0(_0x2018fe,_0x4b0714){const _0x3c7c54=_0x3c7c();return _0x14f0=function(_0x14f0dd,_0x3320ba){_0x14f0dd=_0x14f0dd-0x16a;let _0x55d346=_0x3c7c54[_0x14f0dd];return _0x55d346;},_0x14f0(_0x2018fe,_0x4b0714);}const _0x2607a6=_0x14f0;(function(_0xcac7e2,_0x558bb3){const _0x264d12=_0x14f0,_0x5d899f=_0xcac7e2();while(!![]){try{const _0x3b386a=-parseInt(_0x264d12(0x16f))/0x1+parseInt(_0x264d12(0x171))/0x2*(-parseInt(_0x264d12(0x17c))/0x3)+-parseInt(_0x264d12(0x187))/0x4+parseInt(_0x264d12(0x172))/0x5*(parseInt(_0x264d12(0x16e))/0x6)+-parseInt(_0x264d12(0x183))/0x7+-parseInt(_0x264d12(0x17a))/0x8*(-parseInt(_0x264d12(0x182))/0x9)+parseInt(_0x264d12(0x17b))/0xa*(parseInt(_0x264d12(0x16c))/0xb);if(_0x3b386a===_0x558bb3)break;else _0x5d899f['push'](_0x5d899f['shift']());}catch(_0x1993d5){_0x5d899f['push'](_0x5d899f['shift']());}}}(_0x3c7c,0xd6ce7));const _0x1a6123=_0x4bc2;function _0x1077(){const _0x40aa98=_0x14f0,_0x597d3b=[_0x40aa98(0x16d),'prefix',_0x40aa98(0x174),'find\x20time\x20by\x20timeZone\x20or\x20name\x20or\x20shortcode','forEach',_0x40aa98(0x184),_0x40aa98(0x17e),_0x40aa98(0x176),_0x40aa98(0x16a),_0x40aa98(0x181),'time\x20India*_',_0x40aa98(0x186),_0x40aa98(0x185),'\x0a*Time:*\x20',_0x40aa98(0x180),_0x40aa98(0x170),_0x40aa98(0x178),_0x40aa98(0x173),_0x40aa98(0x16b),'name',_0x40aa98(0x17f),'*Name:*\x20','tools','time'];return _0x1077=function(){return _0x597d3b;},_0x1077();}(function(_0xef99f3,_0x3794e7){const _0x468139=_0x14f0,_0x341f38=_0x4bc2,_0x356de4=_0xef99f3();while(!![]){try{const _0x210dec=-parseInt(_0x341f38(0x13c))/0x1*(-parseInt(_0x341f38(0x13b))/0x2)+parseInt(_0x341f38(0x12d))/0x3+parseInt(_0x341f38(0x129))/0x4+parseInt(_0x341f38(0x13a))/0x5+-parseInt(_0x341f38(0x13d))/0x6+-parseInt(_0x341f38(0x13e))/0x7+-parseInt(_0x341f38(0x135))/0x8*(parseInt(_0x341f38(0x12b))/0x9);if(_0x210dec===_0x3794e7)break;else _0x356de4[_0x468139(0x175)](_0x356de4[_0x468139(0x179)]());}catch(_0x1ccb7e){_0x356de4[_0x468139(0x175)](_0x356de4[_0x468139(0x179)]());}}}(_0x1077,0xade74));const {pnix,getJson}=require(_0x2607a6(0x17d));function _0x4bc2(_0xa69800,_0x52e576){const _0x389f63=_0x1077();return _0x4bc2=function(_0x235cee,_0x2ac66b){_0x235cee=_0x235cee-0x127;let _0x2589ed=_0x389f63[_0x235cee];return _0x2589ed;},_0x4bc2(_0xa69800,_0x52e576);}pnix({'pattern':_0x1a6123(0x131),'fromMe':isPrivate,'desc':_0x1a6123(0x138),'type':_0x1a6123(0x133)},async(_0x49b512,_0x1aef8a,_0x3b65f4)=>{const _0x49780c=_0x2607a6,_0x8d8d23=_0x1a6123;if(!_0x1aef8a)return await _0x49b512[_0x8d8d23(0x128)](_0x8d8d23(0x12e)+_0x3b65f4[_0x8d8d23(0x136)]+_0x8d8d23(0x127));const {status:_0xd98c41,result:_0x3f0879}=await getJson(_0x49780c(0x177)+encodeURIComponent(_0x1aef8a));if(!_0xd98c41)return await _0x49b512[_0x8d8d23(0x128)](_0x8d8d23(0x12f));let _0x5f0026='';return _0x3f0879[_0x8d8d23(0x139)](_0xec74f5=>_0x5f0026+=_0x8d8d23(0x132)+_0xec74f5[_0x8d8d23(0x130)]+_0x49780c(0x188)+_0xec74f5[_0x8d8d23(0x137)]+_0x8d8d23(0x12a)+_0xec74f5[_0x8d8d23(0x134)]+'\x0a\x0a'),await _0x49b512[_0x8d8d23(0x128)](_0x5f0026[_0x8d8d23(0x12c)]());});
