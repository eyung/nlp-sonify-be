const natural = require('natural');
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());

let corsOptions = {
  origin: ["http://localhost:3000", "https://nlp-sonify-be.vercel.app"],
};
app.use(cors(corsOptions));

// Create an instance of Natural NLP components (e.g., tokenizer, stemmer, etc.)
const tokenizer = new natural.TreebankWordTokenizer();
const stemmer = natural.PorterStemmer;

const testString = "this is a test";

// Define API endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.post('/api/tokenize', (req, res) => {
  const text = req.body.text;
  console.log("Text : " + text);
  const tokens = tokenizer.tokenize(text);
  res.json(tokens);
});

app.post('/api/stem', (req, res) => {
  const word = req.body.word;
  console.log("Word : " + word);
  const stemmedWord = stemmer.stem(word);
  res.json(stemmedWord);
});

// Start the server
// for local testing use 5000
//const port = 5000;
const port = process.env.PORT || 3000; // Use the assigned port from Vercel or fallback to a default port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});