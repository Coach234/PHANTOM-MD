const fetch = require('node-fetch');
const BRAINSHOP_BID = '176023';
const BRAINSHOP_KEY = 'LDSYmkI28NH1qFuN';

const user = m.sender;

if (!user.chatbot) {
  return true;
}

const uid = encodeURIComponent(m.sender);
const match = encodeURIComponent(match); // Use match instead of m.text

const response = await fetch(`http://api.brainshop.ai/get?bid=${BRAINSHOP_BID}&key=${BRAINSHOP_KEY}&uid=${uid}&msg=${match}`);
const data = await response.json();

const reply = data.cnt;

message.reply(reply);
