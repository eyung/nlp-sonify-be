const express = require('express');
const axios = require('axios');
//const { completeChat, generateEmbedding, convertTextToSpeech, transcribeSpeech } = require('./openai.js');

// Create an instance of the Express router
const router = express.Router();

// Test chat completion end point
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

// Get complexity scores
router.post('/complexity-scores', async (req, res) => {
  const { text } = req.body;
  // Call OpenAI API here with the text
  const prompt = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "Calculate the sentiment scores of the input to indicate whether the overall sentiment is positive, negative, or neutral. This will be represented as an array eg. [0.7, 0.2, 0.1] for 70% positive, 20% neutral, 10% negative. Do not explain how your arrived at your answer, simply provide the array as the output."
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

// Get sentiment scores
router.post('/sentiment-scores', async (req, res) => {
  const { text } = req.body;
  // Call OpenAI API here with the text
  const prompt = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "Calculate the sentiment scores of the input to indicate whether the overall sentiment is positive, negative, or neutral. This will be represented as an array eg. [0.7, 0.2, 0.1] for 70% positive, 20% neutral, 10% negative. Do not explain how your arrived at your answer, simply provide the array as the output. "
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
    "max_tokens": 2500,
    "presence_penalty": 0,
    "frequency_penalty": 2
  };
  const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
  res.json(response.data);
});

// Get concreteness scores
router.post('/concreteness-scores', async (req, res) => {
  const { text } = req.body;
  // Call OpenAI API here with the text
  const prompt = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "Measure the degree to which the text refers to tangible, recognizable things versus abstract concepts. This will be represented as an float value ranging from 1.0 to 0.0, where 1.0 indicates that the text refers to tangible things and 0.0 indicates abstractiveness. Do not explain how your arrived at your answer, simply provide the value as the output. "
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
    "max_tokens": 2500,
    "presence_penalty": 0,
    "frequency_penalty": 2
  };
  const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
  res.json(response.data);
});

// Get emotional intensity scores
router.post('/emotional-intensity-scores', async (req, res) => {
  const { text } = req.body;
  // Call OpenAI API here with the text
  const prompt = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "Measure the 'arousel' level of the text, as defined in psychology which refers to the text's level of alertness or exciteness expressed. Considering high-intensity emotions like anger or excitement. This will be represented as an float value ranging from 1.0 to 0.0, where 1.0 indicates a high level of emotional intensity and 0.0 indicates lowest level of emotional intensity. Do not explain how your arrived at your answer, simply provide the value as the output. "
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
    "max_tokens": 2500,
    "presence_penalty": 0,
    "frequency_penalty": 2
  };
  const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
  res.json(response.data);
});

module.exports = router;