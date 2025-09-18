const express = require("express");
const mailgun = require("mailgun-js");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mailgun setup
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// ✅ Mail Subscription Route
app.post("/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  console.log("✅ Received email:", email);

  const data = {
    from: `mailgun@${process.env.MAILGUN_DOMAIN}`,
    to: email,
    subject: "Welcome to DEV@Deakin!",
    text: "Thanks for subscribing to DEV@Deakin!",
  };

  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    console.log("❌ OpenAI Key not loaded.");
  } else {
    console.log("🧠 OpenAI Key Loaded:", true);
  }

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error("❌ Email Error:", error.message);
      return res.status(500).json({ success: false, message: "Email failed to send." });
    } else {
      console.log("📧 Email sent:", body);
      return res.json({ success: true, message: "Welcome email sent!" });
    }
  });
});

// ✅ GPT Assistant Route
app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log("🤖 GPT reply:", reply);
    res.json({ success: true, reply });
  } catch (error) {
    console.error("❌ GPT Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "GPT request failed." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("🔑 Mailgun API Key:", process.env.MAILGUN_API_KEY);
  console.log("🌐 Mailgun Domain:", process.env.MAILGUN_DOMAIN);
  console.log("🧠 OpenAI Key Loaded:", !!process.env.OPENAI_API_KEY);
});
