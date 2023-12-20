const { pnix, parsedJid } = require("../lib");
const SUDO = require('../config');

pnix(
  {
    pattern: "setpp",
    fromMe: true,
    type: "owner",
  },
  async (message, match, m) => {
    if (!message.reply_message.image)
      return await message.reply("_Reply To A Photo_");
    let buff = await m.quoted.download();
    await message.setPP(message.user, buff);
    return await message.reply("_Profile Picture Updated ✅_");
  }
);

pnix(
  {
    pattern: "setname",
    fromMe: true,
    type: "owner",
  },
  async (message, match) => {
    if (!match) return await message.reply("_Enter A Name_");
    await message.updateName(match);
    return await message.reply(`_Username Updated : ${match} ✅_`);
  }
);

pnix(
  {
    pattern: "block",
    fromMe: true,
    type: "owner",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply To A Person Or Mention_");
      await message.block(jid);
      return await message.sendMessageMessage(`_@${jid.split("@")[0]} Blocked ✅_`, {
        mentions: [jid],
      });
    } else {
      await message.block(message.jid);
      return await message.reply("_User Blocked ✅_");
    }
  }
);

pnix(
  {
    pattern: "unblock",
    fromMe: true,
    type: "owner",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply To A Person Or Mention_");
      await message.block(jid);
      return await message.sendMessage(`_@${jid.split("@")[0]} Unblocked ✅_`, {
        mentions: [jid],
      });
    } else {
      await message.unblock(message.jid);
      return await message.reply("_User Unblocked ✅_");
    }
  }
);

pnix(
  {
    pattern: "jid",
    fromMe: true,
    type: "owner",  
  },
  async (message, match) => {
    return await message.sendMessage(
      message.mention[0] || message.reply_message.jid || message.jid
    );
  }
);

pnix(
  {
    pattern: "dlt",
    fromMe: true,
    type: "owner", 
  },
  async (message, match,m,client) => {
    if (message.isGroup) {
      client.sendMessage(message.jid, { delete: message.reply_message.key })
    }
  }
);
