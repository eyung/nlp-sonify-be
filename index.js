const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const wordnetRouter = require('./api/wordnetRouter'); 
const nlpRouter = require('./api/nlpRouter'); 
const { analyzeText, completeChat, generateEmbedding, convertTextToSpeech, transcribeSpeech } = require('./openaiRouter'); 

const app = express();

let corsOptions = {
  //origin: ["https://nlp-sonify-app.vercel.app", "http://localhost:5000"],
  origin: '*',
  //credentials: true
};

app.use(cors(corsOptions));

//app.use(express.json());
app.use(bodyParser.json());

// Create an instance of Express Router
const router = express.Router();

// Route for text analysis
router.post('/analyze', async (req, res) => {
  const { text } = req.body;
  
  // Call the OpenAI API for text analysis
  const analysisResult = await analyzeText(text);

  // Respond with the analysis result
  res.json(analysisResult);
});

// Route for chat completion
router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    // Call the OpenAI API for chat completion
    const response = await completeChat(prompt);

    // Respond with the chat completion result
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


// Mount API function
app.use('/', wordnetRouter);
app.use('/', nlpRouter);
app.use('/', router);


// Start the server
const port = process.env.PORT || 5000; // Use the assigned port from Vercel or fallback to a default port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the Express API
module.exports = app