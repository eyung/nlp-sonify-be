const natural = require('natural');
const pos = require('pos');
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

router.get('/api/pos/tags', (req, res) => {
    const sentence = req.body.sentence;

    if (!sentence) {
        res.status(400).json({ error: 'Missing sentence in request body' });
        return;
    }

    console.log("Sentence : " + sentence);

    // Tokenize the sentence into words
    const words = tokenizer.tokenize(sentence);

    const taggedWords = words.map((word) => {
        const tagger = new pos.Tagger();
        const taggedWord = tagger.tag([word])[0];
        const wordText = taggedWord[0];
        const tag = taggedWord[1];
    
        return { word: wordText, tag };
      });
    
      res.json(taggedWords);
  });

// Export the router
module.exports = router;