//import OpenAI from "openai";

const express = require('express');
const axios = require('axios');
const { completeChat, generateEmbedding, convertTextToSpeech, transcribeSpeech } = require('./openai.js');

// Create an instance of the Express router
const router = express.Router();

//const fetch = require('node-fetch');

//const OPENAI_API_KEY = process.env.OPENAI_TEST_KEY;

//const openai = new OpenAI({
//  apiKey: process.env.OPENAI_TEST_KEY,
//});

// Test
router.post('/analyze', async (req, res) => {
  const { text } = req.body;
  // Call OpenAI API here with the text
  const prompt = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "Calculate the user's age expressed in number of days, based on the birthday that they have entered. Assume the current date is 20 December 2023. Do not explain how your arrived at your answer, simply provide an integer value as the output."
      },
      {
        "role": "user",
        "content": text
      }
    ],
    "temperature": 0,
    "top_p": 1,
    "n": 1,
    "stream": false,
    "max_tokens": 250,
    "presence_penalty": 0,
    "frequency_penalty": 2
  };
  const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
  res.json(response.data);
});

module.exports = router;

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