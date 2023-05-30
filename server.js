const natural = require('natural');
const express = require('express');

const app = express();

// Create an instance of Natural NLP components (e.g., tokenizer, stemmer, etc.)
const tokenizer = new natural.TreebankWordTokenizer();
const stemmer = natural.PorterStemmer;

const testString = "this is a test";

// Define API endpoints
app.get('/api/test', (req, res) => {
  // Handle the request and send a response
  res.json({ message: 'Hello, world!' });
});

app.post('/api/tokenize', (req, res) => {
  const text = req.query.text;
  console.log(text);
  const tokens = tokenizer.tokenize(text);
  res.json(tokens);
});

app.post('/api/stem', (req, res) => {
  const word = req.query.word;
  const stemmedWord = stemmer.stem(word);
  res.json(stemmedWord);
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});