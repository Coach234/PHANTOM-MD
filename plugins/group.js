const config = require("../config");
const { pnix, isAdmin, parsedJid, isUrl } = require("../lib/");

const abhiGpCheck = async (message) => {
  if (!message.isGroup) {
    return await message.reply("_*This Command Is Only For Groups*_");
  }

  const isUserAdmin = await isAdmin(message.jid, message.user, message.client);
  if (!isUserAdmin) {
    return await message.reply("*_This Command Is Only For Admins_*");
  }

  const isBotAdmin = await isAdmin(message.jid, message.client.user.jid, message.client);
  if (!isBotAdmin) {
    return await message.reply("*_I M Not An Admin_*");
  }
};

pnix(
  {
    pattern: "add ?(.*)",
    fromMe: true,
    desc: "add a person to group",
    type: "group",
  },
  async (message, match) => {
    await abhiGpCheck(message);

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to add");

    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "add");

    return await message.reply(`_@${jid[0].split("@")[0]} added_`, {
      mentions: [jid],
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
    await abhiGpCheck(message);

    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.reply(`@${jid[0].split("@")[0]} kicked`, {
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
    await abhiGpCheck(message);

    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.promote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} promoted as admin`, {
      mentions: jid,
    });
  }
);

pnix(
  {
    pattern: "demote",
    fromMe: true,
    desc: "demote a member",
    type: "group",
  },
  async (message, match) => {
    await abhiGpCheck(message);

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to demote");
    const botAdmin = await isAdmin(message.jid, message.client.user.jid, message.client);
    if (!botAdmin) {
      return await message.reply("*_I M Not An Admin_*");
    }
    let jid = parsedJid(match);
    await message.demote(jid);

    return await message.reply(`@${jid[0].split("@")[0]} *Demoted From Admin*`, {
      mentions: jid,
    });
  }
);

pnix(
  {
    on: "text",
  },
  async (message, match) => {
    await abhiGpCheck(message);

    if (!message.isGroup) return;
    if (config.ANTILINK)
      if (isUrl(match)) {
        await message.reply("_Link Detected Successfully_");
        let botadmin = await isAdmin(message.jid, message.user, message.client)
        let senderadmin = await isAdmin(message.jid, message.participant, message.client)
        if (botadmin) {
          if (!senderadmin){
            await message.reply(
              `_Commencing Specified Action :${config.ANTILINK_ACTION}_`
            );
            return await message[config.ANTILINK_ACTION]([message.participant]);
          }
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
    await abhiGpCheck(message);

    if (!message.isGroup) {
      return await message.reply("_*This Command Is Only For Groups*_");
    }
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
    await abhiGpCheck(message);

    if (!message.isGroup)
      return await message.reply("_*This Command Is Only For Groups*_");
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

pnix({
    pattern: "mute",
    fromMe: true,
    desc: "Mute group",
    type: "group"
}, async (message, match, _, client) => {
    await abhiGpCheck(message);

    if (!message.isGroup) {
        return await message.reply("_*This Command Is Only For Groups*_");
    }

    await message.reply("_Muting_");
    await client.groupSettingUpdate(message.jid, "announcement", true);
});

pnix(
  {
    pattern: "unmute",
    fromMe: true,
    desc: "unmute group",
    type: "group",
  },
  async (message, match, m, client) => {
    await abhiGpCheck(message);

    if (!message.isGroup)
      return await message.reply("_*This Command Is Only For Groups*_");
    await message.reply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);
