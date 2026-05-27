const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ message: "Chat service is not configured" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fashionExpertPrompt = `You are a fashion expert. Please assist the user with fashion-related advice. User says: "${message.trim()}"`;
    const result = await model.generateContent(fashionExpertPrompt);
    const response = await result.response;

    return res.json({ reply: response.text() });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate chat response" });
  }
});

module.exports = router;
