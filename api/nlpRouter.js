const natural = require('natural');
const express = require('express');

// Create an instance of the Express router
const router = express.Router();

// Create an instance of Natural NLP components (e.g., tokenizer, stemmer, etc.)
const tokenizer = new natural.TreebankWordTokenizer();
const stemmer = natural.PorterStemmer;

// Define API endpoints
router.get('/api/test', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

router.get('/api/tokenize', (req, res) => {
  const text = req.body.text;
  console.log("Text : " + text);
  const tokens = tokenizer.tokenize(text);
  res.json(tokens);
});

router.get('/api/stem', (req, res) => {
  const word = req.body.word;
  console.log("Word : " + word);
  const stemmedWord = stemmer.stem(word);
  res.json(stemmedWord);
});

// Export the router
module.exports = router;