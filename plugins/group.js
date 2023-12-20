const config = require("../config");
const { pnix, isAdmin, parsedJid, isUrl } = require("../lib/");

pnix(
  {
    pattern: "add ?(.*)",
    fromMe: true,
    desc: "add a person to group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This Command Is Only For Admins_*");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to add");

    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("*_I M Not An Admin_*");
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
    if (!message.isGroup)
      return await message.reply("*_This Command Is Only For Admins_*");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("*_I M Not An Admin_*");
    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.reply(`@${jid[0].split("@")[0]} kicked`, {
      mentions: jid,
    });
  }
);

System({
	pattern: "promote$",
	fromMe: true,
	desc: "promote a member",
	type: "group",
}, async (message, match) => {
	if (!message.isGroup)
	return await message.send("*_This Command Is Only For Groups*_");
	match = message.mention.jid?.[0] || message.reply_message.sender || match
	if (!match) return await message.send("_Mention A User To Promote_");
	let isadmin = await isAdmin(message, message.user.jid);
	if (!isadmin) return await message.send("*_I M Not An Admin_*");
	let jid = parsedJid(match);
	await await message.client.groupParticipantsUpdate(message.jid, jid, "promote");
	return await message.client.sendMessage(message.chat, {text: `_@${jid[0].split("@")[0]} Is Now An Admin_`, mentions: jid, });
});

pnix(
  {
    pattern: "demote",
    fromMe: true,
    desc: "demote a member",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This Command Is Only For Admins_*");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to demote");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("*_I M Not An Admin_*");
    let jid = parsedJid(match);
    await message.demote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} demoted from admin`, {
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
        await message.reply("_Link detected_");
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
    if (!message.isGroup) return;
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
      return await message.reply("*_This Command Is Only For Admins_*");
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
    if (!message.isGroup) {
        return await message.reply("*_This Command Is Only For Admins_*");
    }

    if (!isAdmin(message.jid, message.user, client)) {
        return await message.reply("_You are not an admin_");
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
    if (!message.isGroup)
      return await message.reply("*_This Command Is Only For Admins_*");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("*_I M Not An Admin_*");
    await message.reply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);

pnix({
    pattern: 'link ?(.*)',
    fromMe: true,
    desc: "Provides the group's invitation link.",
    type: 'group'
}, async (message) => {
    if (!message.isGroup)
    return await message.reply("*_This Command Is Only For Groups*_");
    let isadmin = await isAdmin(message, message.user.jid);
    if (!isadmin) return await message.send("*_I M Not An Admin_*");
    const data = await message.client.groupInviteCode(message.data.bot);
    return await message.reply(`https://chat.whatsapp.com/${data}`)
