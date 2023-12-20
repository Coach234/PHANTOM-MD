const config = require("../config");
const { pnix, isAdmin, parsedJid, isUrl } = require("../lib/");

pnix(
  {
    pattern: "add ?(.*)",
    fromMe: true,
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This Command Is Only For Groups_*");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("*_I M Not An Admin_*");
    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.add(jid);
    return await message.reply(`@${jid[0].split("@")[0]} Added`, {
      mentions: jid,
    });
  }
);

pnix(
  {
    pattern: "kick ?(.*)",
    fromMe: true,
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This Command Is Only For Groups*_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("*_I M Not An Admin_*");
    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.reply(`@${jid[0].split("@")[0]} Kicked`, {
      mentions: jid,
    });
  }
);

pnix(
  {
    pattern: "promote ?(.*)",
    fromMe: true,
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This Command Is Only For Groups*_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("*_I M Not An Admin_*");
    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.promote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} Promoted As Admin`, {
      mentions: jid,
    });
  }
);
pnix(
  {
    pattern: "demote ?(.*)",
    fromMe: true,
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This Command Is Only For Groups*_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("*_I M Not An Admin_*");
    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.demote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} Demoted From Admin`, {
      mentions: jid,
    });
  }
);

/**
 * antilink
*/
pnix(
  {
    on: "text",
  },
  async (message, match) => {
    if (!message.isGroup) return;
    if (config.ANTILINK)
      if (isUrl(match)) {
        await message.reply("_Link Detected_");
        let botadmin = await isAdmin(message.jid, message.user, message.client)
        let senderadmin = await isAdmin(message.jid, message.participant, message.client)
        if (botadmin) {
          if (!senderadmin){
          await message.reply(
            `_Commencing Specified Action :${config.ANTILINK_ACTION}_`
          );
          return await message[config.ANTILINK_ACTION]([message.participant]);
        }} else {
          return await message.reply("*_I M Not An Admin_*");
        }
      }
  }
);

pnix(
  {
    pattern: "tagall ?(.*)",
    fromMe: true,
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) 
    return await message.reply("*_This Command Is Only For Groups*_");
    const { participants } = await message.client.groupMetadata(message.jid);
    let teks = "";
    for (let mem of participants) {
      teks += ` @${mem.id.split("@")[0]}\n`;
    }
    message.sendMessage(teks.trim(), {
      mentions: participants.map((a) => a.id),
    });
  }
);

pnix(
  {
    pattern: "gjid",
    fromMe: true,
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("*_This Command Is Only For Groups*_");
    let { participants } = await client.groupMetadata(message.jid);
    let participant = participants.map((u) => u.id);
    let str = "╭──〔 *Group Jids* 〕\n";
    participant.forEach((result) => {
      str += `├ *${result}*\n`;
    });
    str += `╰──────────────`;
    message.reply(str);
  }
);
