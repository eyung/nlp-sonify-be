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
        "content": "Calculate the complexity score of the given text. This score should be a float value ranging from -1.0 to 1.0, where 1.0 indicates the highest level of complexity and -1.0 indicates the lowest level of complexity. The score should take into account a wide range of factors, including but not limited to: Vocabulary richness: Consider the diversity and sophistication of the words used in the text; Sentence length: Longer sentences are generally more complex than shorter ones.; Readability scores: Use established readability metrics like Flesch-Kincaid, Gunning Fog, or Coleman-Liau; Syntactic complexity: Consider the complexity of the sentence structures used in the text; Semantic complexity: Consider the complexity of the ideas and concepts conveyed by the text. The calculation should be deterministic, meaning that the same text should always yield the same complexity score. Do not provide an explanation of how the score was calculated, simply return the score as the output."
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
        "content": "Calculate the sentiment scores of the given text. This score should be an array of three float values ranging from 0.0 to 1.0, representing the percentages of positive, neutral, and negative sentiment respectively. For example, [0.7, 0.2, 0.1] would indicate 70% positive, 20% neutral, and 10% negative sentiment. The scores should take into account a wide range of factors, including but not limited to: Lexical sentiment: Consider the sentiment of individual words and phrases in the text; Contextual sentiment: Consider the sentiment implied by the context in which words and phrases are used; Structural sentiment: Consider the sentiment conveyed by the structure of the text, such as the use of exclamatory sentences to express strong emotion. The calculation should be deterministic, meaning that the same text should always yield the same sentiment scores. Do not provide an explanation of how the scores were calculated, simply return the scores as the output."
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
    "max_tokens": 250,
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
    "max_tokens": 250,
    "presence_penalty": 0,
    "frequency_penalty": 2
  };
  const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
  res.json(response.data);
});

module.exports = router;