const natural = require('natural');
const pos = require('pos');
const express = require('express');

// Create an instance of the Express router
const router = express.Router();

const wordnet = new natural.WordNet();
const tokenizer = new natural.WordTokenizer();

//
// Define API endpoints
//

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

  const results = [];
  const promises = [];

  // Use the WordNet module to find all lexnames of the word
  for (let i = 0; i < words.length; i++) {
    const promise = new Promise((resolve, reject) => {
      wordnet.lookup(words[i], (result) => {
        if (result.length > 0) {
     
          const wordInfo = result.map((synset) => ({
            word: words[i],
            lexFilenum: synset.lexFilenum,
            lemma: synset.lemma,
            pos: synset.pos,
          }));

          results.push(...wordInfo);

          // Convert the Set objects to arrays because Sets are not serializable to JSON
          //const lexFilenums = Array.from(new Set(result.map((synset) => synset.lexFilenum)));

          //console.log('Word:', words[i], '| Lex File Numbers:', lexFilenums);
          //results.push({ word: words[i], lexFilenum: lexFilenums });
        } else {
          results.push({
            word: words[i],
            lexFilenum: 'Not found',
            lemma: 'Not found',
            pos: 'Not found',
          });

          //results.push({ word: words[i], lexFilenum: 'Not found' });
        }
        resolve(); // Resolve the promise after processing the word
      });
    });
  
    promises.push(promise);
  }
  
  Promise.all(promises)
    .then(() => {
      console.log('Results:', results);
      res.json({ results });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });

  let relation = 'unknown';
    //if (tag.startsWith('NN')) {
    //  relation = 'noun';
    //} else if (tag.startsWith('VB')) {
    //  relation = 'verb';
    //} else if (tag.startsWith('JJ')) {
    //  relation = 'adjective';
    //} else if (tag.startsWith('RB')) {
    //  relation = 'adverb';
    //}


});

// Export the router
module.exports = router;