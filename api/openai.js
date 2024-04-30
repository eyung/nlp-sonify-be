// openai.js
const axios = require('axios');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Function for chat completion using OpenAI's API
async function completeChat(prompt) {
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-002', // Example model
      prompt: prompt,
      max_tokens: 100,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error completing chat:', error.response ? error.response.data : error.message);
    throw new Error('Failed to complete chat');
  }
}

// Other functions for other OpenAI APIs...

module.exports = {
  completeChat,
  // Other functions...
};
