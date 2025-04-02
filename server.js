import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;

    const prompt = `Write a ${tone} social media post about "${topic}" for the ${platform} platform. Keep it short and engaging.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/", (req, res) => {
  res.send("Health Hook backend is up!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
