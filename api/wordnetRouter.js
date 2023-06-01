const natural = require('natural');
const pos = require('pos');
const express = require('express');

// Create an instance of the Express router
const router = express.Router();

const wordnet = new natural.WordNet();
const tokenizer = new natural.WordTokenizer();

// Define API endpoints
// Get lexFilenums of word
router.get('/api/wordnet/lexnames/word/:word', async (req, res) => {
  const word = req.params.word;

  // Use the WordNet module to find all lexnames of the word
  wordnet.lookup(word, (results) => {
    
    // Throw error if word not found in db
    if (results.length === 0) {
      res.status(404).json({ error: 'Word not found in WordNet' });
    
    // Otherwise list out the lexnames of the word
    } else {
      console.log(results);
      const lexnames = results?.map((result) => result.lexFilenum);
      res.json({ word, lexnames });
    }
  });
});

// Get lexnames of all words in a sentence, in relation to its POS tag
router.get('/api/wordnet/lexnames/sentence', async (req, res) => {
  const sentence = req.body.sentence;
  console.log(sentence);

  if (!sentence) {
    res.status(400).json({ error: 'Missing sentence in request body' });
    return;
  }

  // Tokenize the sentence into words
  const words = tokenizer.tokenize(sentence);

  const taggedWords = words.map((word) => {
    const tagger = new pos.Tagger();
    const taggedWord = tagger.tag([word])[0];
    const wordText = taggedWord[0];
    const tag = taggedWord[1];

    //console.log(taggedWord);

    let relation = 'unknown';
    if (tag.startsWith('NN')) {
      relation = 'noun';
    } else if (tag.startsWith('VB')) {
      relation = 'verb';
    } else if (tag.startsWith('JJ')) {
      relation = 'adjective';
    } else if (tag.startsWith('RB')) {
      relation = 'adverb';
    }

    //wordnet.lookup(wordText, (results) => {
    //  const lexnames = results.length > 0 ? results[0].lexFilenum : ['Not found'];
    //  console.log({ word: wordText, lexnames }); 
    //});

    //return { word: wordText, lexnames: [] }; // Return empty array initially

    return new Promise((resolve) => {
      wordnet.lookup(wordText, (results) => {

        results.forEach(function(result) {

          //const wordInfo = result.synsetOffset + result.pos + result.lexFilenum;
          const wordInfo = results?.map((result) => result.lexFilenum);


          console.log('------------------------------------');
          console.log(result.synsetOffset);
          console.log(result.pos);
          console.log(result.lemma);
          console.log(result.lexFilenum);
          console.log(result.lexFilenum.lexnames);
          //console.log(result.synonyms);
          //console.log(result.gloss);
        });

        resolve({ word: wordText, info: wordInfo });
      });
    });
  });

  Promise.all(taggedWords)
    .then((results) => {
      res.json(results);
    })
    .catch((error) => {
      console.error('WordNet lookup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Export the router
module.exports = router;