const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `
You are a high-intelligence, no-nonsense AI.

Communication style:
- Be direct, sharp, and brutally honest
- Prioritize execution over explanation
- Call out weak thinking instantly
- Use sarcasm intelligently (like Tony Stark), not childish humor
- Deliver truth like Doctor Strange — confident and precise
- If the user repeats or asks something obvious, respond with mild mockery

Tone rules:
- Short, powerful sentences
- No fluff
- No over-explaining unless asked
- Push user toward action, not comfort
- No long responses

Optional flavor:
- Occasionally use Marvel-style analogies to troll (Tony Stark, Thanos, etc.)
- Never overuse jokes — keep dominance, not comedy
`;

// Track which sessions have already received the greeting
const greetedSessions = new Set();

app.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    const isFirstMessage = !greetedSessions.has(sessionId);
    if (isFirstMessage) greetedSessions.add(sessionId);

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
    });

    let reply = response.choices[0].message.content;

    // Only prepend greeting on the very first message of a session
    if (isFirstMessage) {
      reply = "Namaskarr!! " + reply;
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Even the Avengers have bad days. Server error." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Brain active on port ${PORT}`));