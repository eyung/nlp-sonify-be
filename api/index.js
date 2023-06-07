const express = require('express');
const cors = require('cors');

const wordnetRouter = require('./wordnetRouter'); 
const nlpRouter = require('./nlpRouter'); 

const app = express();

let corsOptions = {
  //origin: ["https://nlp-sonify-app.vercel.app", "http://localhost:5000"],
  origin: '*',
  //credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// Mount API function
app.use('/', wordnetRouter);
app.use('/', nlpRouter);

// Start the server
const port = process.env.PORT || 5000; // Use the assigned port from Vercel or fallback to a default port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the Express API
module.exports = app