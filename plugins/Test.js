const {

  Function,
  isPrivate,
  getUrl,
  fromBuffer,
  getBuffer,
  getJson,
  AddMp3Meta,
  createMap,
  formatBytes,
  parseJid,
  isUrl,
  parsedJid,
  styletext,
  decodeJid,
  runtime,
  clockString,
  sleep,
  pnix,

} = require("../lib/");
const util = require("util");
const config = require("../config");
pnix({pattern:'eval', 
         on: "text",
         fromMe: true,
         desc :'Runs a server code',
         type: "owner"}, 
         async (message, match, m, client) => {
  if (match.startsWith(">")) {
    try {
      let evaled = await eval(`${match.replace(">", "")}`);
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      await message.reply(evaled);
    } catch (err) {
      await message.reply(util.format(err));

    }

  }

});
