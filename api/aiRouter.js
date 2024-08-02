const express = require('express');
const axios = require('axios');

// Create an instance of the Express router
const router = express.Router();

// Helper function to make API call
async function callOpenAI(text, systemMessage) {
    const prompt = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "As a researcher for textual analysis, for each sentence or phrase of the given text, you will calculate a score for a given characteristic that will be specified to you in subsequent prompts. All calculations should be deterministic. Do not provide an explanation for how the scores were calculated, simply return the scores as the output with the first word for the sentence or phrase that it corresponds to in JSON format. For example, when asked about the sentiment score for the sentence 'You are helpful' should give a result in this format: 'sentiment':[{'You':'0.5'}]"
        },
        {
          "role": "system",
          "content": systemMessage
        },
        {
          "role": "user",
          "content": text
        }
      ],
      // other parameters
        "temperature": 0,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "max_tokens": 250,
        "presence_penalty": 0,
        "frequency_penalty": 2,
        "type": "json_object"
    };
  
    const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
    return response.data;
}

// Test chat completion end point
router.post('/scores', async (req, res) => {
    const { text } = req.body;
    const systemMessages = [
        "Calculate the sentiment score. The score should be float values ranging from -1.0 to 1.0, representing the percentage of negative, neutral, or positive sentiments. For example, 0.7 would indicate 70% positive, -0.1 means 10% negative, and 0.0 is neutral. The scores should consider a wide range of factors, including but not limited to lexical, contextual and structural sentiments.",
        "Calculate the complexity score. This score should be a float value ranging from -1.0 to 1.0, where 1.0 indicates the highest level of complexity and -1.0 indicates the lowest level of complexity. Consider a wide range of factors, including but not limited to vocabulary richness, sentence length, readability scores (by using metrics like Flesch-Kincaid, Gunning Fog, or Coleman-Liau), syntactic complexity, and semantic complexity.",
        "Measure the degree to which the text refers to tangible, recognizable things versus abstract concepts. This will be represented as a float value ranging from 1.0 to 0.0, where 1.0 indicates that the text refers to tangible things and 0.0 indicates abstractiveness.",
        "Measure the 'arousel' level of the text, as defined in psychology which refers to the text's level of alertness or exciteness expressed. Considering high-intensity emotions like anger or excitement. This will be represented as n float value ranging from 1.0 to 0.0, where 1.0 indicates a high level of emotional intensity and 0.0 indicates lowest level of emotional intensity.",
    ];

    const promises = systemMessages.map(systemMessage => callOpenAI(text, systemMessage));
    const responses = await Promise.all(promises);
    res.json(responses);
});

// Test end point for combining scores
router.post('/v1/scores', async (req, res) => {
  const { text } = req.body;
  // Call OpenAI API here with the text
  const prompt = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "As a researcher for textual analysis, for each sentence or phrase, create a set of JSON objects where the key is the first word of the sentence, the values are the following: 1) Complexity Score from -1.0 to 1.0 where 1.0 indicates the highest level of complexity and -1.0 indicates the lowest; 2) Sentiment Analysis Score from -1.0 to 1.0, consider a wide range of factors, including but not limited to lexical, contextual and structural sentiments; 3) Concreteness Score from 1.0 to 0.0 where 1.0 indicates that the text refers to tangible things and 0.0 indicates abstractiveness; 4) Emotional-Intesity Score from 1.0 to 0.0 where 1.0 indicates a high level of emotional intensity and 0.0 indicates lowest level of emotional intensity."
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
    "max_tokens": 650,
    "presence_penalty": 0,
    "frequency_penalty": 2,
    "response_format":{"type": "json_object"}
  };
  const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
  res.json(response.data);
});

module.exports = router;