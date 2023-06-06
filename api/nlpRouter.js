const natural = require('natural');
const pos = require('pos');
const express = require('express');

// Create an instance of the Express router
const router = express.Router();

// Create an instance of Natural NLP components (e.g., tokenizer, stemmer, etc.)
const tokenizer = new natural.TreebankWordTokenizer();
const wordnet = new natural.WordNet();
const stemmer = natural.PorterStemmer;

// Define API endpoints
router.get('/api/test', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

router.get('/api/tokenize', (req, res) => {
  const text = req.body.text;
  console.log("Text : " + text);
  const tokens = tokenizer.tokenize(text);
  res.json({tokens});
});

router.post('/api/stem', (req, res) => {
  const word = req.body.word;
  const stemmedWord = stemmer.stem(word);
  //res.setHeader('Content-Type', 'application/json'); // Set response content type
  res.json({stemmedWord});
});

//TODO:
router.get('/api/lexname', (req, res) => {
    const word = req.body.word;

    wordnet.lookup(word, (results) => {
    if (results.length > 0) {
        const lexname = results[0].lexFilenum;
        console.log('Lexname:', lexname);
    } else {
        console.log('Word not found in WordNet');
    }
    });

res.json({word});
});

router.get('/api/pos/tags', (req, res) => {
    const sentence = req.body.sentence;

    if (!sentence) {
        res.status(400).json({ error: 'Missing sentence in request body' });
        return;
    }

    // Tokenize the sentence into words
    const words = tokenizer.tokenize(sentence);

    // Tag each word with its corresponding POS
    const taggedWords = words.map((word) => {
        const tagger = new pos.Tagger();
        const taggedWord = tagger.tag([word])[0];
        const wordText = taggedWord[0];
        const tag = taggedWord[1];
    
        return { word: wordText, tag };
    });
    
    res.json({taggedWords});
});

router.get('/api/nlp/pos/tags', async (req, res) => {
    const sentence = req.body.sentence;

    if (!sentence) {
        res.status(400).json({ error: 'Missing sentence in request body' });
        return;
    }

    const taggedWords = tagWords(sentence);
    //console.log(taggedWords);

    res.json({taggedWords});
});

function tagWords(sentence) {
    const language = "EN"
    const defaultCategory = 'N';
    const defaultCategoryCapitalized = 'NNP';

    var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
    var ruleSet = new natural.RuleSet('EN');
    var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

    const words = tokenizer.tokenize(sentence);
    const taggedWords = tagger.tag(words);

    return taggedWords;
}
  
// Export the router
module.exports = router;