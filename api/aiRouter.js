import express from 'express';
import axios from 'axios';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

// Create an instance of the Express router
const router = express.Router();

// Define schema for the request body using Zod
const scores = z.object({
  sentences: z.array(
    z.object({
      word: z.object({
        "Complexity Score": z.number().min(-1.0).max(1.0),
        "Sentiment Analysis Score": z.number().min(-1.0).max(1.0),
        "Concreteness Score": z.number().min(-1.0).max(1.0),
        "Emotional-Intensity Score": z.number().min(-1.0).max(1.0)
      })
    })
  )
});

// Define the JSON schema manually
const scoresSchema = {
  "name": "scoresSchema",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "word": {
        "type": "object",
        "properties": {
          "Complexity Score": { "type": "number", "minimum": -1.0, "maximum": 1.0 },
          "Sentiment Analysis Score": { "type": "number", "minimum": -1.0, "maximum": 1.0 },
          "Concreteness Score": { "type": "number", "minimum": -1.0, "maximum": 1.0 },
          "Emotional-Intensity Score": { "type": "number", "minimum": -1.0, "maximum": 1.0 }
        },
        "required": ["Complexity Score", "Sentiment Analysis Score", "Concreteness Score", "Emotional-Intensity Score"]
      }
    },
    "required": ["word"]
  }
};

// Test end point for combining scores
// Using GPT 4o mini model
router.post('/v1/scores', async (req, res) => {
  const { text } = req.body;

  const prompt = {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "As a researcher for textual analysis, for each sentence or phrase, create a collection of JSON objects where the keys are the first word of each sentence, the values are the following: 1) Complexity Score from -1.0 to 1.0 where 1.0 indicates the highest level of complexity and -1.0 indicates the lowest; 2) Sentiment Analysis Score from -1.0 to 1.0, consider a wide range of factors, including but not limited to lexical, contextual and structural sentiments; 3) Concreteness Score from 1.0 to 0.0 where 1.0 indicates that the text refers to tangible things and 0.0 indicates abstractiveness; 4) Emotional-Intesity Score from 1.0 to 0.0 where 1.0 indicates a high level of emotional intensity and 0.0 indicates lowest level of emotional intensity."
          }
        ]
      },
      {
        "role": "user",
        "content": text
      }
    ],
    "temperature": 0,
    "top_p": 1,
    "max_tokens": 5000,
    "presence_penalty": 0,
    "frequency_penalty": 0,
    "response_format":{"type": "json_object"}
  };
  const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
  res.json(response.data);
});

// Endpoint for scores related to text analysis
// Output is structured as JSON objects
// Using GPT 4o mini model
router.post('/v2/scores', async (req, res) => {
  const { text } = req.body;
  const systemMessage = "For each sentence or phrase, create a collection of JSON objects where the keys are the first word of each sentence, the values are the following: 1) Complexity Score from -1.0 to 1.0 where 1.0 indicates the highest level of complexity and -1.0 indicates the lowest; 2) Sentiment Analysis Score from -1.0 to 1.0, consider a wide range of factors, including but not limited to lexical, contextual and structural sentiments; 3) Concreteness Score from -1.0 to 1.0 where 1.0 indicates that the text refers to tangible things and -1.0 indicates abstractiveness; 4) Emotional-Intesity Score from -1.0 to 1.0 where 1.0 indicates a high level of emotional intensity and -1.0 indicates lowest level.";
  
  const prompt = {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": systemMessage
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
    "max_tokens": 950,
    "presence_penalty": 0,
    "frequency_penalty": 0,
    "response_format": { "type": "json_object" },
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
    res.json(response.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


// Endpoint for scores related to text analysis
// Using OpenAI Structured Outputs as response format
// Using GPT 4o mini model
router.post('/v3/scores', async (req, res) => {
  const { text } = req.body;
  const systemMessage = "For each sentence or phrase, create a collection of JSON objects where the keys are the first word of each sentence, the values are the following: 1) Complexity Score from -1.0 to 1.0 where 1.0 indicates the highest level of complexity and -1.0 indicates the lowest; 2) Sentiment Analysis Score from -1.0 to 1.0, consider a wide range of factors, including but not limited to lexical, contextual and structural sentiments; 3) Concreteness Score from -1.0 to 1.0 where 1.0 indicates that the text refers to tangible things and -1.0 indicates abstractiveness; 4) Emotional-Intesity Score from -1.0 to 1.0 where 1.0 indicates a high level of emotional intensity and -1.0 indicates lowest level.";
  
  const prompt = {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": systemMessage
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
    "max_tokens": 950,
    "presence_penalty": 0,
    "frequency_penalty": 0,
    //"response_format": zodResponseFormat(scoresSchema, "scoresSchema"),
    //"response_format": { "type": "json_object" },
    response_format: {
      "type": "json_schema",
      "json_schema": {
        "name": "scoresSchema",
  "strict": true,
  "schema": {
    "type": "object",
    "required": [
      "sentences"
    ],
    "properties": {
      "sentences": {
        "type": "array",
        "items": {
          "type": "object",
          "required": [
            "word",
            "Complexity Score",
            "Sentiment Analysis Score",
            "Concreteness Score",
            "Emotional-Intensity Score",
            "Activeness Score"
          ],
          "properties": {
            "word": {
              "type": "string"
            },
            "Activeness Score": {
              "type": "number"
            },
            "Complexity Score": {
              "type": "number"
            },
            "Concreteness Score": {
              "type": "number"
            },
            "Sentiment Analysis Score": {
              "type": "number"
            },
            "Emotional-Intensity Score": {
              "type": "number"
            }
          },
          "additionalProperties": false
        }
      }
    },
    "additionalProperties": false
  }
      }
    },
  };

  //if (completion.choices[0].finish_reason === "length") {
    // Handle the case where the model did not return a complete response
  //  throw new Error("Incomplete response");
  //}

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
    //const validatedData = scoresSchema.parse(response.data);
    //res.json(validatedData);

    res.json(response.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Endpoint for scores related to text analysis
// Using OpenAI Structured Outputs as response format
// Input is split into chunks of 1000 tokens for better performance
// Using GPT 4o mini model
router.post('/v4/scores', async (req, res) => {
  const { text } = req.body;
  const systemMessage = "For each sentence or phrase, create a collection of JSON objects where the keys are the first word of each sentence, the values are the following: 1) Complexity Score from -1.0 to 1.0 where 1.0 indicates the highest level of complexity and -1.0 indicates the lowest; 2) Sentiment Analysis Score from -1.0 to 1.0, consider a wide range of factors, including but not limited to lexical, contextual and structural sentiments; 3) Concreteness Score from -1.0 to 1.0 where 1.0 indicates that the text refers to tangible things and -1.0 indicates abstractiveness; 4) Emotional-Intesity Score from -1.0 to 1.0 where 1.0 indicates a high level of emotional intensity and -1.0 indicates lowest level.";
  
  const chunks = text.match(/[\s\S]{1,1000}/g) || []; // Split text into chunks of 1000 characters
  const results = [];

  for (const chunk of chunks) {
    const prompt = {
      "model": "gpt-4o-mini",
      "messages": [
        {
          "role": "system",
          "content": systemMessage
        },
        {
          "role": "user",
          "content": chunk
        }
      ],
      "temperature": 0,
      "top_p": 1,
      "n": 1,
      "stream": false,
      "max_tokens": 950,
      "presence_penalty": 0,
      response_format: {
        "type": "json_schema",
        "json_schema": {
          "name": "scoresSchema",
          "strict": true,
          "schema": {
            "type": "object",
            "required": [
              "sentences"
            ],
            "properties": {
              "sentences": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "word",
                    "Complexity Score",
                    "Sentiment Analysis Score",
                    "Concreteness Score",
                    "Emotional-Intensity Score",
                    "Activeness Score"
                  ],
                  "properties": {
                    "word": {
                      "type": "string"
                    },
                    "Activeness Score": {
                      "type": "number"
                    },
                    "Complexity Score": {
                      "type": "number"
                    },
                    "Concreteness Score": {
                      "type": "number"
                    },
                    "Sentiment Analysis Score": {
                      "type": "number"
                    },
                    "Emotional-Intensity Score": {
                      "type": "number"
                    }
                  },
                  "additionalProperties": false
                }
              }
            },
            "additionalProperties": false
          }
        }
      },
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', prompt, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
      results.push(response.data);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  res.json(results);
});

export default router;