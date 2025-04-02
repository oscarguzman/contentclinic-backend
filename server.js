import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// ✅ Define the app first
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Allow only your frontend origin (CORS)
app.use(cors({
  origin: "https://content-clinic.onrender.com",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight requests
app.options("*", cors());

app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;

    const prompt = `Write a ${tone} social media post about "${topic}" for the ${platform} platform. Keep it short and engaging.`;

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${
