const got = require("got");
const Heroku = require("heroku-client");
const { version } = require("../package.json");
const { pnix, isPrivate, tiny } = require("../lib/");
const Config = require("../config");
const { SUDO } = require("../config");
const heroku = new Heroku({ token: Config.HEROKU_API_KEY });
const baseURI = "/apps/" + Config.HEROKU_APP_NAME;
const simpleGit = require("simple-git");
const { secondsToDHMS } = require("../lib");
const git = simpleGit();
const exec = require("child_process").exec;



pnix({
    pattern: "restart",
    fromMe: true,
  },
  async (message) => {
    await message.send(`_🔄 Restarting_`);
    await heroku.delete(baseURI + "/dynos").catch(async (error) => {
      await message.send(`*HEROKU : ${error.body.message}*`);
    });
  });



pnix({
    pattern: "shutdown",
    fromMe: true,
  },
  async (message) => {
    await heroku
      .get(baseURI + "/formation")
      .then(async (formation) => {
        await message.send(`_Shut Downing Phoenix-MD_`);
        await heroku.patch(baseURI + "/formation/" + formation[0].id, {
          body: {
            quantity: 0,
          },
        });
      })
      .catch(async (error) => {
        await message.send(`HEROKU : ${error.body.message}`);
      });
  });



pnix(
  {
    pattern: "setvar",
    fromMe: true,
  },
  async (message, match) => {
    if (!match)
      return await message.send(`*📌 Example:* .setvar SUDO:919074692450`);
    const key = match.slice(0, match.indexOf(':')).trim();
    const value = match.slice(match.indexOf(':') + 1).trim();
    if (!key || !value)
      return await message.send(`*📌 Example:* .setvar SUDO:919074692450`);
    heroku
      .patch(baseURI + "/config-vars", {
        body: {
          [key.toUpperCase()]: value,
        },
      })
      .then(async () => {
        await message.send(`${key.toUpperCase()}: ${value}`);
      })
      .catch(async (error) => {
        await message.send(`HEROKU: ${error.body.message}`);
      });
  }
);



pnix({
    pattern: "delvar",
    fromMe: true,
  },
  async (message, match) => {
    if (!match) return await message.send("*📌 Example:* delvar sudo");
    heroku
      .get(baseURI + "/config-vars")
      .then(async (vars) => {
        const key = match.trim().toUpperCase();
        if (vars[key]) {
          await heroku.patch(baseURI + "/config-vars", {
            body: {
              [key]: null,
            },
          });
          return await message.send(`_Deleted ${key}_`);
        }
        await message.send(`_${key} Not Found_`);
      })
      .catch(async (error) => {
        await message.send(`*HEROKU : ${error.body.message}*`);
      });
  });



pnix({
  pattern: "allvar",
  fromMe: true,
},
async (message) => {
  let msg = "Here Is The All Heroku Vars\n\n\n";
  try {
    const keys = await heroku.get(baseURI + "/config-vars");
    for (const key in keys) {
      msg += `${key} : ${keys[key]}\n\n`;
    }
    await message.send(msg + "");
  } catch (error) {
    await message.send(`HEROKU : ${error.message}`);
  }
});



pnix({
  pattern: "update",
  fromMe: true,
},
async (message, match) => {
  let { prefix } = message;
  if (match === "now") {
    await git.fetch();
    var commits = await git.log([
      Config.BRANCH + "..origin/" + Config.BRANCH,
    ]);
    if (commits.total === 0) {
      return await message.send(`_Phoenix-MD Is Now On The Latest Version: v${version}_`);
    } else {
      await message.reply("_Updating Phoenix-MD_");

      try {
        var app = await heroku.get("/apps/" + Config.HEROKU_APP_NAME);
      } catch {
        await message.send("_❌ Invalid Heroku Details_");
        await new Promise((r) => setTimeout(r, 1000));
      }

      git.fetch("upstream", Config.BRANCH);
      git.reset("hard", ["FETCH_HEAD"]);

      var git_url = app.git_url.replace(
        "https://",
        "https://api:" + Config.HEROKU_API_KEY + "@"
     );

      try {  
        await git.addRemote("heroku", git_url);
      } catch {
        console.log("heroku remote error");
      }
      await git.push("heroku", Config.BRANCH);

      await message.send("  _Phoenix-MD Updated Sucessfully✅_");
    }
  }
  await git.fetch();
  var commits = await git.log([Config.BRANCH + "..origin/" + Config.BRANCH]);
  if (commits.total === 0) {
    await message.send("_Phoenix-MD Is Already On The Latest Version_");
  } else {
    var availupdate = "*New Update Avalible For Phoenix-MD* \n\n";
    commits["all"].map((commit, num) => {
      availupdate += num + 1 + " ○  " + tiny(commit.message) + "\n";
    });
    return await message.client.sendMessage(message.jid, {
      text: `${availupdate}\n\n _Type *${Config.HANDLERS} update now To Update*_`
    });
  }
});
