import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_KEY = "sk-proj-..." // your real key here

app.post("/generate", async (req, res) => {
  const { topic, tone, platform } = req.body;

  const prompt = `Write a ${tone} social media post about "${topic}" for the ${platform} platform. Keep it short and engaging.`;

  try {
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
    const result = json.choices?.[0]?.message?.content || "No content generated.";

    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
