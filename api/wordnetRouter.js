const natural = require('natural');
const express = require('express');

// Create an instance of the Express router
const router = express.Router();

var wordnet = new natural.WordNet();

// Define an API endpoint handler function
router.get('/api/wordnet', (req, res) => {
    
    const text = req.body.text;
    console.log("Text : " + text);

    wordnet.lookup(text, function(results) {
        results.forEach(function(result) {
            console.log('------------------------------------');
            //console.log(result.synsetOffset);
            //console.log(result.pos);
            //console.log(result.lemma);
            //console.log(result.synonyms);
            //console.log(result.pos);
            //console.log(result.gloss);

            const synsets = "hi"
        });
    });
  
    // Return the result as a JSON response
    res.json(synsets);
  });

  router.get('/api/wordnet-test/:word', async (req, res) => {
    const word = req.params.word;
  
    // Use the WordNet module to perform desired operations
    // For example, find synsets (synonyms) for a given word
    wordnet.lookup(word, (err, synsets) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        // Extract the synonyms from the synsets
        const synonyms = synsets.map((synset) => synset.words).flat();
        res.json({ word });
      }
    });
  });

// Export the router
module.exports = router;