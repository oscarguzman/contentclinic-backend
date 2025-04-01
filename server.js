const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const OPENAI_KEY = "sk-proj-..."; // Replace with your OpenAI API key

app.post("/generate", async (req, res) => {
  const { topic, tone, platform } = req.body;

  if (!topic || !tone || !platform) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const prompt = `Write a ${tone} social media post about "${topic}" for the ${platform} platform. Keep it short and engaging.`;

  try {
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const json = await gptRes.json();
    const result = json.choices?.[0]?.message?.content || "No content generated";

    res.json({ result });
  } catch (err) {
    console.error("GPT Error:", err);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});