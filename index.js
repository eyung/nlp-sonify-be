//const natural = require('natural');
const express = require('express');

const cors = require("cors");

const wordnetRouter = require('./api/wordnetRouter'); 
const nlpRouter = require('./api/nlpRouter'); 

const app = express();
app.use(express.json());

let corsOptions = {
  origin: ["http://localhost:3000", "https://nlp-sonify-be.vercel.app"],
};
app.use(cors(corsOptions));

// Mount API function
app.use('/', wordnetRouter);
app.use('/', nlpRouter);

// Start the server
const port = process.env.PORT || 3000; // Use the assigned port from Vercel or fallback to a default port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the Express API
module.exports = app