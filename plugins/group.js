const config = require("../config");
const { pnix, isAdmin, parsedJid, isPrivate, isUrl } = require("../lib/");


pnix(
  {
    pattern: "add ?(.*)",
    fromMe: true,
    desc: "add a person to group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_*This Command Is Only For Groups*_");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention User To Add_");

    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("_*Make Me Admin To Proceed*_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "add");

    return await message.reply(`_@${jid[0].split("@")[0]} Added ✅_`, {
      mentions: [jid],
    });
  }
);

pnix(
  {
    pattern: "kick ?(.*)",
    fromMe: true,
    desc: "kicks a person from group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_*This Command Is Only For Groups*_");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention User To Kick_");

    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("_*Make Me Admin To Proceed*_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "remove");

    return await message.reply(`_@${jid[0].split("@")[0]} Kicked ✅_`, {
      mentions: [jid],
    });
  }
);

pnix(
  {
    pattern: "promote ?(.*)",
    fromMe: true,
    desc: "promote to admin",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_*This Command Is Only For Groups*_");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention User To Promote_");

    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("_*Make Me Admin To Proceed*_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "promote");

    return await message.reply(`_@${jid[0].split("@")[0]} Promoted As An Admin ✅_`, {
      mentions: [jid],
    });
  }
);
pnix(
  {
    pattern: "demote ?(.*)",
    fromMe: true,
    desc: "demote from admin",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_*This Command Is Only For Groups*_");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention User To Demote_");

    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("_*Make Me Admin To Proceed*_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "demote");

    return await message.reply(
      `_*@${jid[0].split("@")[0]} Demoted From Admin ✅*_`,
      {
        mentions: [jid],
      }
    );
  }
);

pnix(
  {
    pattern: "mute",
    fromMe: true,
    desc: "mnute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_*This Command Is Only For Groups*_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_*Make Me Admin To Proceed*_");
    await message.reply("_Muting_");
    return await client.groupSettingUpdate(message.jid, "announcement");
  }
);

pnix(
  {
    pattern: "unmute",
    fromMe: true,
    desc: "unmute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_*This Command Is Only For Groups*_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_*Make Me Admin To Proceed*_");
    await message.reply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);

pnix(
  {
    pattern: "gjid",
    fromMe: isPrivate,
    desc: "gets jid of all group members",
    type: "group",
  },
  async (message, match, m, client) => {
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

pnix(
  {
    pattern: "tagall ?(.*)",
    fromMe: isPrivate,
    desc: "mention all users in group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) {
      return await message.reply("_*This Command Is Only For Groups* only_");
    }

    const { participants } = await message.client.groupMetadata(message.jid);
    let teks = "";
    for (let mem of participants) {
      teks += ` @${mem.id.split("@")[0]}\n`;
    }
    message.sendMessage(message.jid, teks.trim(), {
      mentions: participants.map((a) => a.id),
    });
  }
);


pnix(
  {
    pattern: "totag",
    fromMe: isPrivate,
    type: "group",
  },
  async (message, match, m) => {
    if (!message.isGroup) {
      return await message.reply("_*This Command Is Only For Groups*_");
    }

    if (!message.quoted && !match) {
      return await message.client.sendMessage(message.jid, {
        text: `_Enter A Message_\n_📌 Example: *${m.prefix}totag Hello Everyone Its Phoenix-MD*_`,
        quoted: message,
      });
    }

    const { participants } = await message.client.groupMetadata(message.jid);

    let responseText = match;

    let usersToMention = participants.map(u => u.id).filter(v => v !== message.client.user.jid);
    
    if (message.quoted) {
      message.client.sendMessage(message.jid, { forward: message.quoted.fakeObj, mentions: usersToMention });
    } else {
      message.client.sendMessage(message.jid, { text: `${responseText}`, mentions: usersToMention });
    }
  }
);

pnix({
	pattern: 'left ?(.*)',
	fromMe: true,
	desc: 'Left from group',
	type: 'group'
}, async (message) => {
    if (!message.isGroup)
    return await message.reply("_*This Command Is Only For Groups*_");
    await message.client.groupLeave(message.jid)
});

                                    
  pnix({
    pattern: 'link ?(.*)',
    fromMe: isPrivate,
    desc: "Provides the group's invitation link.",
    type: 'group'
}, async (message) => {
    if (!message.isGroup)
    return await message.reply("_*This Command Is Only For Groups*_");
    const isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.send("_*Make Me Admin To Proceed*_");
    const data = await message.client.groupInviteCode(message.jid);
    return await message.reply(`*Group Link 🔗*\nhttps://chat.whatsapp.com/${data}`);
});

pnix(
  {
    on: "text",
    fromMe: false,
  },
  async (message, match) => {
    if (!message.isGroup) return;
    if (config.ANTILINK)
      if (isUrl(match)) {
        await message.reply("_*Link Detected*_");
        let botadmin = await isAdmin(message.jid, message.user, message.client);
        let senderadmin = await isAdmin(
          message.jid,
          message.participant,
          message.client
        );
        if (botadmin) {
          if (!senderadmin) {
            await message.reply(
              `_Performing Specified Action :*${config.ANTILINK_ACTION}*_`
            );
            return await message[config.ANTILINK_ACTION]([message.participant]);
          }
        } else {
          return await message.reply("_*Make Me Admin To Proceed*_");
        }
      }
  }
);
	    
