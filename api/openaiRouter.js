//import OpenAI from "openai";

const express = require('express');
const { completeChat, generateEmbedding, convertTextToSpeech, transcribeSpeech } = require('./openai.js');

// Create an instance of the Express router
const router = express.Router();

//const fetch = require('node-fetch');

//const OPENAI_API_KEY = process.env.OPENAI_TEST_KEY;

//const openai = new OpenAI({
//  apiKey: process.env.OPENAI_TEST_KEY,
//});

// Route for chat completion
router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const response = await completeChat(prompt);
    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for generating embeddings
router.post('/embeddings', async (req, res) => {
  // Implementation for generating embeddings API
});

// Route for text-to-speech
router.post('/text-to-speech', async (req, res) => {
  // Implementation for text-to-speech API
});

// Route for speech-to-text
router.post('/speech-to-text', async (req, res) => {
  // Implementation for speech-to-text API
});

module.exports = router;