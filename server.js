require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { StreamChat } = require("stream-chat");
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize Stream Chat SDK

const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

app.post("/transcript", async (req, res) => {
  const { messages } = req.body;
  let html = "<h1>Your Chat Transcript</h1>";
  messages.forEach(msg => {
    html += `<p><strong>${msg.user.name}</strong>: ${msg.text}</p>`;
  });

  nodemailerMailgun.sendMail(
    {
      from: "chat@example.com",
      to: "ayisaiah@gmail.com",
      subject: "Chat transcript",
      html
    },
    err => {
      if (err) {
        console.log(`Error: ${err}`);
        res.status(500);
      } else {
        res.status(200);
      }
    }
  );
});

app.post("/join", async (req, res) => {
  const { username } = req.body;
  const token = serverSideClient.createToken(username);
  try {
    await serverSideClient.updateUser(
      {
        id: username,
        name: username
      },
      token
    );
    const admin = { id: "admin" };
    const channel = serverSideClient.channel("messaging", "livechat", {
      name: "Customer support",
      created_by: admin
    });

    await channel.create();
    await channel.addMembers([username]);
  } catch (err) {
    console.log(err);
  }

  return res
    .status(200)
    .json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
});

app.listen(7000, () => {
  console.log(`Server running on PORT 7000`);
});
