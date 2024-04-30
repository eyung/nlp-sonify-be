// openai.js
const fetch = require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_TEST_KEY;

// Function for chat completion using OpenAI's API
async function completeChat(prompt) {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-002', // Example model
      prompt: prompt,
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

// Other functions for other OpenAI APIs...

module.exports = {
  completeChat,
  // Other functions...
};
