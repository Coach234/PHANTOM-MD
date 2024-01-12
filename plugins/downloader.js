var videotime = 0xea60;
var dlsize = 0x3e8;
const fs = require('fs');
let gis = require('g-i-s');
pnix({
  'pattern': "song",
  'fromMe': isPrivate,
  'type': "downloader"
}, async (_0x4117df, _0x3f5b5d, _0x5e089e) => {
  _0x4117df.client.sendMessage(_0x4117df.jid, {
    'react': {
      'text': '🎧',
      'key': _0x5e089e.key
    }
  });
  if (!_0x3f5b5d) {
    return await _0x4117df.reply("_Enter A Song Name/Link_\n_📌 Example *" + _0x5e089e.prefix + "song Heat Waves*_");
  }
  let _0x4a42f2 = require("yt-search");
  let _0x1c1571 = await _0x4a42f2(_0x3f5b5d);
  let _0x2c8f70 = _0x1c1571.videos[0x0];
  let _0x35900c = await ytdl.getInfo(_0x2c8f70.url);
  if (_0x35900c.videoDetails.lengthSeconds >= 0xea60) {
    return _0x4117df.reply("*Video File Is Too Big*");
  }
  let _0x41640f = _0x35900c.videoDetails.title;
  let _0x499900 = '' + Math.floor(Math.random() * 0x2710) + ".mp3";
  await _0x4117df.client.sendMessage(_0x4117df.jid, {
    'text': "_Downloading " + _0x41640f + '_'
  }, {
    'quoted': _0x5e089e
  });
  const _0xef55a1 = ytdl(_0x2c8f70.url, {
    'filter': _0x43a51d => _0x43a51d.audioBitrate == 0xa0 || _0x43a51d.audioBitrate == 0x80
  }).pipe(fs.createWriteStream("./media/" + _0x499900));
  await new Promise((_0x398bde, _0x501194) => {
    _0xef55a1.on("error", _0x501194);
    _0xef55a1.on('finish', _0x398bde);
  });
  let _0x5b3fd0 = fs.statSync("./media/" + _0x499900);
  let _0x9502fa = _0x5b3fd0.size;
  let _0x2a8825 = _0x9502fa / 1048576;
  if (_0x2a8825 <= 0x3e8) {
    await _0x4117df.client.sendMessage(_0x4117df.jid, {
      'text': "_Uploading " + _0x41640f + '_'
    }, {
      'quoted': _0x5e089e
    });
    let _0x5161ce = {
      'audio': fs.readFileSync("./media/" + _0x499900),
      'mimetype': "audio/mpeg",
      'fileName': _0x41640f + '.mp3'
    };
    await _0x4117df.client.sendMessage(_0x4117df.jid, _0x5161ce, {
      'quoted': _0x5e089e
    });
    return fs.unlinkSync("./media/" + _0x499900);
  } else {
    _0x4117df.reply("_File size bigger than 100mb_");
  }
  fs.unlinkSync("./media/" + _0x499900);
});
pnix({
  'pattern': "play",
  'fromMe': isPrivate,
  'type': "downloader"
}, async (_0x29a54a, _0x4e99dc, _0x537462) => {
  _0x29a54a.client.sendMessage(_0x29a54a.jid, {
    'react': {
      'text': '🎼',
      'key': _0x537462.key
    }
  });
  if (!_0x4e99dc) {
    return await _0x29a54a.reply("_Enter A Song Name/Link_\n_📌 Example *" + _0x537462.prefix + "song Heat Waves*_");
  }
  let _0x591bc3 = require("yt-search");
  let _0x554e92 = await _0x591bc3(_0x4e99dc);
  let _0x2b57ef = _0x554e92.videos[0x0];
  let _0x1914de = await ytdl.getInfo(_0x2b57ef.url);
  if (_0x1914de.videoDetails.lengthSeconds >= 0xea60) {
    return _0x29a54a.reply("*Video file too big*");
  }
  let _0x14b2b6 = _0x1914de.videoDetails.title;
  let _0x5c6427 = '' + Math.floor(Math.random() * 0x2710) + ".mp3";
  await _0x29a54a.client.sendMessage(_0x29a54a.jid, {
    'text': "_Downloading...  " + _0x14b2b6 + '_',
    'contextInfo': {
      'externalAdReply': {
        'title': '' + _0x29a54a.pushName,
        'sourceUrl': _0x2b57ef.url,
        'mediaUrl': _0x2b57ef.url,
        'mediaType': 0x1,
        'showAdAttribution': true,
        'renderLargerThumbnail': true,
        'thumbnailUrl': _0x2b57ef.thumbnail
      }
    }
  }, {
    'quoted': _0x537462
  });
  const _0x240d25 = ytdl(_0x2b57ef.url, {
    'filter': _0x1837d6 => _0x1837d6.audioBitrate == 0xa0 || _0x1837d6.audioBitrate == 0x80
  }).pipe(fs.createWriteStream('./media/' + _0x5c6427));
  await new Promise((_0x81c17d, _0x3dd918) => {
    _0x240d25.on("error", _0x3dd918);
    _0x240d25.on("finish", _0x81c17d);
  });
  let _0x1c3aa8 = fs.statSync("./media/" + _0x5c6427);
  let _0x5db0af = _0x1c3aa8.size;
  let _0x374457 = _0x5db0af / 1048576;
  if (_0x374457 <= 0x3e8) {
    let _0x3aa34b = {
      'audio': fs.readFileSync("./media/" + _0x5c6427),
      'mimetype': "audio/mpeg",
      'fileName': _0x14b2b6 + ".mp3"
    };
    await _0x29a54a.client.sendMessage(_0x29a54a.jid, _0x3aa34b, {
      'quoted': _0x537462
    });
    return fs.unlinkSync("./media/" + _0x5c6427);
  } else {
    _0x29a54a.reply("*File Size Bigger Than 100Mb*");
  }
  fs.unlinkSync('./media/' + _0x5c6427);
});
pnix({
  'pattern': "img",
  'fromMe': isPrivate,
  'type': 'downloader'
}, async (_0x54b157, _0x396368, _0x20f0cb) => {
  if (!_0x396368) {
    return await _0x54b157.sendMessage("_Enter A Text And Number Of Images You Want_\n_📌 Example : *" + _0x20f0cb.prefix + "img Pheonix MD,6*_");
  }
  let [_0x6f550e, _0x2c21a3] = _0x396368.split(',');
  let _0x205c13 = await gimage(_0x6f550e, _0x2c21a3);
  await _0x54b157.sendMessage("_Downloading... " + (_0x2c21a3 || 0x5) + " Images For " + _0x6f550e + '_');
  for (let _0x1f7388 of _0x205c13) {
    await _0x54b157.sendFromUrl(_0x1f7388);
  }
});
async function gimage(_0x379088, _0x338583 = 0x5) {
  let _0x4c9c2c = [];
  return new Promise((_0x1f3a81, _0x503058) => {
    gis(_0x379088, async (_0x18e2e2, _0x328349) => {
      for (var _0x43b9fc = 0x0; _0x43b9fc < (_0x328349.length < _0x338583 ? _0x328349.length : _0x338583); _0x43b9fc++) {
        _0x4c9c2c.push(_0x328349[_0x43b9fc].url);
        _0x1f3a81(_0x4c9c2c);
      }
    });
  });
}
pnix({
  'pattern': "yts",
  'fromMe': isPrivate,
  'type': "tools"
}, async (_0x54b2f2, _0x2e0276, _0x53985b) => {
  _0x54b2f2.client.sendMessage(_0x54b2f2.jid, {
    'react': {
      'text': '🔎',
      'key': _0x53985b.key
    }
  });
  if (!_0x2e0276) {
    return await _0x54b2f2.reply("_Enter A Text To Search_\n_📌 Example *" + _0x53985b.prefix + "yts How To Make WhatsApp Bot*_");
  }
  let _0x3ac769 = require("yt-search");
  let _0x540ed5 = await _0x3ac769(_0x2e0276);
  if (!_0x540ed5.videos || _0x540ed5.videos.length === 0x0) {
    return await _0x54b2f2.reply("_No Results Found For *" + _0x2e0276 + '*_');
  }
  let _0x179ce4 = '';
  for (let _0x284eed = 0x0; _0x284eed < Math.min(0x14, _0x540ed5.videos.length); _0x284eed++) {
    let _0x25392c = _0x540ed5.videos[_0x284eed];
    let _0x181e4c = await ytdl.getInfo(_0x25392c.url);
    let _0x379036 = phoenix(_0x181e4c.videoDetails.lengthSeconds);
    let _0xc11b2a = _0x181e4c.videoDetails.title;
    _0x179ce4 += "\n╭─────────────❮\n *✒️ ᴛɪᴛʟᴇ:* " + _0xc11b2a + "\n \n *🔗 ʟɪɴᴋ:* " + _0x25392c.url + "\n \n *⏱ ᴅᴜʀᴀᴛɪᴏɴ:* " + _0x379036 + "\n╰─────────────⦁\n      ";
  }
  await _0x54b2f2.client.sendMessage(_0x54b2f2.jid, {
    'text': _0x179ce4
  }, {
    'quoted': _0x53985b
  });
});
function phoenix(_0x33718b) {
  const _0x27338f = Math.floor(_0x33718b / 0xe10);
  const _0x5c7672 = Math.floor(_0x33718b % 0xe10 / 0x3c);
  const _0x338e85 = _0x33718b % 0x3c;
  let _0x46aab3 = '';
  if (_0x27338f > 0x0) {
    _0x46aab3 += _0x27338f + " hour ";
  }
  _0x46aab3 += _0x5c7672 + "m " + _0x338e85 + 's';
  return _0x46aab3.trim();
}
