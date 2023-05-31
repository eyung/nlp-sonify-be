const natural = require('natural');
const express = require('express');

// Create an instance of the Express router
const router = express.Router();

var wordnet = new natural.WordNet();

// Define an API endpoint handler function
  router.get('/api/wordnet/lexnames/:word', async (req, res) => {
    const word = req.params.word;

    // Use the WordNet module to find all lexnames of the word
    wordnet.lookup(word, (errs, results) => {
      if (errs) {
        console.error(errs);
        //res.json({ error: err });
        const lexnames = errs?.map((err) => err.lexFilenum);
        res.json({ word, lexnames });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Word not found in WordNet' });
      } else {
        // Extract the lexnames from the results

        const lexnames = results?.map((result) => result.lexname);
        res.json({ word, lexnames });
      }
    });
  });

// Export the router
module.exports = router;