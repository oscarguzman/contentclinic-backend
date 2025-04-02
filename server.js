// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;

    const prompt = `Write a ${tone} social media post about \"${topic}\" for the ${platform} platform. Keep it short and engaging.`;

    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = await gptResponse.json();
    const result = json.choices?.[0]?.message?.content;

    res.json({ result });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
