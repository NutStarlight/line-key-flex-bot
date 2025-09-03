const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@line/bot-sdk');

const app = express();
app.use(bodyParser.json());

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};
const client = new Client(config);

// Key Message → Flex mapping
const flexMessages = {
  "#promo1": {
    type: "flex",
    altText: "โปรโมชั่นพิเศษ!",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          { type: "text", text: "🔥 โปรโมชั่นพิเศษ 1 🔥", weight: "bold", size: "lg" },
          { type: "text", text: "ลดทันที 50% วันนี้เท่านั้น", wrap: true }
        ]
      }
    }
  },
  "#info": {
    type: "flex",
    altText: "ข้อมูลร้าน",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          { type: "text", text: "📍 ร้าน Example Cafe", weight: "bold", size: "lg" },
          { type: "text", text: "เปิดทุกวัน 9:00 - 18:00 น.", wrap: true }
        ]
      }
    }
  }
};

// Webhook endpoint
app.post('/', (req, res) => {
  const events = req.body.events || [];
  events.forEach(event => {
    if (event.type === 'message' && event.message.type === 'text') {
      const key = event.message.text.trim();
      const message = flexMessages[key];
      if (message) {
        client.replyMessage(event.replyToken, message);
      }
    }
  });
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('LINE Bot is running');
});

module.exports = app;
