import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import aiRouter from './aiRouter.js';

const app = express();

// Middleware
let corsOptions = {
  origin: ["https://nlp-sonify-app.vercel.app", "http://nlp-sonify-app.vercel.app", "http://localhost:5000"],
  //origin: '*',
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(bodyParser.json());

// Mount API function
app.use('/api', aiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 5000; // Use the assigned port from Vercel or fallback to a default port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the Express API
export default app