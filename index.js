import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import aiRouter from './api/aiRouter.js';
import openaiRouter from './api/openaiRouter.js';

const app = express();

let corsOptions = {
  //origin: ["https://nlp-sonify-app.vercel.app", "http://localhost:5000"],
  origin: '*',
  //credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Mount API function
app.use('/api', openaiRouter);
app.use('/api', aiRouter);

// Start the server
const port = process.env.PORT || 5000; // Use the assigned port from Vercel or fallback to a default port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the Express API
export default app