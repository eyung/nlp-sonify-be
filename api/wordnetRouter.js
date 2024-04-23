const natural = require('natural');
const wordnetDb = require('wordnet-db');
const WordPos = require('wordpos');
const express = require('express');

// Create an instance of the Express router
const router = express.Router();

const wordnet = new natural.WordNet();
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const nounInflector = new natural.NounInflector();
const verbInflector = new natural.PresentVerbInflector();

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

// Get lexnames of all words in a sentence
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

      const normalizedWord = normalizeWord(words.taggedWords[i].token);
      wordnet.lookup(normalizedWord, (result) => {
        if (result.length > 0) {
          
          //console.log(result.pos);
          //if (words.taggedWords[i].tag == result.pos) {
          //}

          //leskAlgorithm(sentence, normalizedWord)
          //.then((bestSense) => {
          //  console.log(`Best sense of "${normalizedWord}": ${bestSense.lexFilenum}`);
          //})
          //.catch((error) => {
          //  console.error(error.message);
          //});

          adaptedLeskAlgorithm(normalizedWord, sentence)
          .then((bestSense) => {
            console.log(`Best sense for "${normalizedWord}" in the sentence:`, bestSense.lexFilenum);
          })
          .catch((error) => {
            console.error(error);
          });

          const wordInfo = result.map((synset) => ({
            word: normalizedWord,
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

// Get word info in relation to its POS tag
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
    const normalizedWord = normalizeWord(word);

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
              //console.log('singular noun:', nounInflector.singularize(word));
              if (result.length > 0) {
                resolve(result);
              // To take into account WordNet only works with singular nouns
              } else {
                wordpos.lookupNoun(nounInflector.singularize(word), (result) => {
                    resolve(result);
                });
              }
            });

            adaptedLeskAlgorithm(normalizedWord, sentence)
              .then((bestSense) => {
                console.log(`Best sense for "${normalizedWord}" in the sentence:`, bestSense.lexFilenum);
              })
              .catch((error) => {
                console.error(error);
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
              //console.log('singular present verb:', verbInflector.singularize(word));
              //console.log('stemmed verb:', stemmer.stem(word));
              if (result.length > 0) {
                resolve(result);
              // To take into account WordNet only works with present tense of verbs
              } else {
                    //wordpos.lookupVerb(verbInflector.pluralize(word), (result) => {
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
        sense: synset.sense
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

  if (postag.startsWith('N')) {
    relation = 'noun';
  } else if (postag.startsWith('V')) {
    relation = 'verb';
  } else if (postag.startsWith('J')) {
    relation = 'adjective';
  } else if (postag.startsWith('RB')) {
    relation = 'adverb';
  } else if (postag.startsWith('CC')) {
    relation = 'coordinating conjunction';
  } else if (postag.startsWith('CD')) {
    relation = 'cardinal number';
  } else if (postag.startsWith('DT')) {
    relation = 'determiner';
  } else if (postag.startsWith('EX')) {
    relation = 'existential there';
  } else if (postag.startsWith('IN')) {
    relation = 'preposition';
  } else if (postag.startsWith('PP')) {
    relation = 'possessive pronoun';
  } else if (postag.startsWith('PRP')) {
    relation = 'personal pronoun';
  } else if (postag.startsWith('TO')) {
    relation = 'to';
  } else if (postag.startsWith('W')) {
    relation = 'wh';
  }
 
  return relation;
}

function leskAlgorithm(sentence, targetWord) {
  return new Promise((resolve, reject) => {
    //const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(sentence);

    wordnet.lookup(targetWord, (synsets) => {

      if (!synsets || synsets.length === 0) {
        reject(new Error(`No synsets found for word "${targetWord}".`));
        return;
      }

      const overlaps = synsets.map((synset) => {
        const gloss = synset.gloss;
        const definitionWords = tokenizer.tokenize(gloss);
     
        const overlap = computeOverlap(words, definitionWords);
        //console.log(targetWord, definitionWords, overlap);

        return { synset, overlap };
      });

      overlaps.sort((a, b) => b.overlap - a.overlap);
      //console.log(overlaps);
      resolve(overlaps[0].synset);
    });
  });
}

async function adaptedLeskAlgorithm(word, sentence) {
  const tokenizer = new natural.WordTokenizer();
  const contextWords = tokenizer.tokenize(sentence.toLowerCase());

  const wordPos = await wordpos.getPOS(word);
  const synsets = await wordpos.lookup(word);

  let bestSense;
  let maxRelatedness = -1;

  for (const synset of synsets) {
    const glossWords = getSynsetGlossWords(synset);

    const vectorA = computeTermFrequencyVector(glossWords);
    const vectorB = computeTermFrequencyVector(contextWords);

    const relatedness = computeCosineSimilarity(vectorA, vectorB);

    if (relatedness > maxRelatedness) {
      maxRelatedness = relatedness;
      bestSense = synset;
    }
  }

  return bestSense;
}


function computeOverlap(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  let overlap = 0;

  set1.forEach((item) => {
    if (set2.has(item)) {
      overlap++;
    }
  });

  //console.log('sentence', set1);
  //console.log('definitions', set2);
  //console.log(overlap);

  return overlap;
}

function normalizeWord(word) {
  const tokenized = tokenizer.tokenize(word);
  const lemmatized = tokenized.map((token) => natural.PorterStemmer.stem(token));
  return lemmatized.join(' ');
}

function getSynsetGlossWords(synset) {
  const gloss = synset.gloss;
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(gloss.toLowerCase());
  return words;
}

function computeCosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const term in vectorA) {
    if (vectorA.hasOwnProperty(term) && vectorB.hasOwnProperty(term)) {
      dotProduct += vectorA[term] * vectorB[term];
      normA += Math.pow(vectorA[term], 2);
      normB += Math.pow(vectorB[term], 2);
    }
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}


function computeTermFrequencyVector(words) {
  const termFrequency = {};
  for (const word of words) {
    termFrequency[word] = (termFrequency[word] || 0) + 1;
  }
  return termFrequency;
}

// Export the router
module.exports = router;