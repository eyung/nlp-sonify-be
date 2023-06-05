const natural = require('natural');
const pos = require('pos');
const WordPos = require('wordpos');
const express = require('express');

// Create an instance of the Express router
const router = express.Router();

const wordnet = new natural.WordNet();
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const wordpos = new WordPos();

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

  if (!sentence) {
    res.status(400).json({ error: 'Missing sentence in request body' });
    return;
  }

  // Tokenize the sentence into words
  //const words = tokenizer.tokenize(sentence);
  const words = tagWords(sentence);

  const results = [];
  const promises = [];

  // Use the WordNet module to find properties of the word
  // words.taggedWords used because tagWords(sentence)
  for (let i = 0; i < words.taggedWords.length; i++) {
    const promise = new Promise((resolve, reject) => {
      wordnet.lookup(words.taggedWords[i].token, (result) => {
        if (result.length > 0) {
          
          //console.log(result.pos);
          //if (words.taggedWords[i].tag == result.pos) {
          //}

          const wordInfo = result.map((synset) => ({
            word: words.taggedWords[i].token,
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
            word: words.taggedWords[i].token,
            lexFilenum: 'Not found',
            lemma: 'Not found',
            pos: 'Not found',
          });

        }
        resolve(); // Resolve the promise after processing the word
      });
    });
  
    promises.push(promise);
  }
  
  Promise.all(promises)
    .then(() => {
      //console.log('Results:', results);
      res.json({ results });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });

});

router.post('/api/wordnet/lookup', async (req, res) => {
  const sentence = req.body.sentence;

  if (!sentence) {
      res.status(400).json({ error: 'Missing sentence in request body' });
      return;
  }

  const words = tagWords(sentence);
  const results = [];

  // Loop through words
  for (let i = 0; i < words.taggedWords.length; i++) {

    const word = words.taggedWords[i].token;

    // Find POS tag in relation to the word in sentence
    const pos = posRelation(words.taggedWords[i].tag);

    // Declare the result variable with a default value
    let result = []; 

    console.log(word, pos);

    let tempLexFileNum;

    // Query WordNet based on POS tag
    switch (pos) {
      case 'noun':
        try {
          result = await new Promise((resolve, reject) => {
            wordpos.lookupNoun(word, (result) => {
              resolve(result);
            });
          });
        } catch (error) {
          console.error('Error:', error);
        }
        break;

      case 'verb':
        try {
          result = await new Promise((resolve, reject) => {
            wordpos.lookupVerb(word, (result) => {
              if (result.length > 0) {
                resolve(result);
              // To take into account WordNet does not work with past tense of verbs
              } else {
                wordpos.lookupVerb(stemmer.stem(word), (result) => {
                    resolve(result);
                });
              }
              
            });
          });
        } catch (error) {
          console.error('Error:', error);
        }
        break;

      case 'adjective':
        try {
          result = await new Promise((resolve, reject) => {
            wordpos.lookupAdjective(word, (result) => {
              resolve(result);
            });
          });
        } catch (error) {
          console.error('Error:', error);
        }
        break;

      case 'adverb':
        try {
          result = await new Promise((resolve, reject) => {
            wordpos.lookupAdverb(word, (result) => {
              resolve(result);
            });
          });
        } catch (error) {
          console.error('Error:', error);
        }
        break;
        
      // Add cases for other POS tags here
      case 'preposition':
        tempLexFileNum = 46;
        break;

      default:
        break;
    }

    if (result.length > 0) {
      const wordInfo = result.map((synset) => ({
        word: word,
        lexFilenum: synset.lexFilenum,
        lexName: synset.lexname,
        lemma: synset.lemma,
        pos: synset.pos,
        wCnt: synset.wCnt,
        gloss: synset.gloss,
        def: synset.def,
      }));

      //console.log("pushing to results:", word);
      results.push(...wordInfo);
    //}
    } else {
      results.push({
        word: word,
        lexFilenum: tempLexFileNum,
        lemma: 'Not found',
        pos: pos,
      });
    }
  }


  //console.log('Results:', results);
  res.setHeader('Content-Type', 'application/json');
  res.json(results);
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

function posRelation(postag) {
  let relation = 'unknown';

  if (postag.startsWith('NN')) {
    relation = 'noun';
  } else if (postag.startsWith('VB')) {
    relation = 'verb';
  } else if (postag.startsWith('JJ')) {
    relation = 'adjective';
  } else if (postag.startsWith('RB')) {
    relation = 'adverb';
  } else if (postag.startsWith('IN')) {
    relation = 'preposition';
  } else if (postag.startsWith('DT')) {
    relation = 'determiner';
  } else if (postag.startsWith('CC')) {
    relation = 'coord conjuncn';
  }
 
  return relation;
}

// Export the router
module.exports = router;