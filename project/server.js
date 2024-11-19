import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import predictRouter from './src/routes/predict.js';
import { errorHandler } from './src/middleware/errorHandler.js';

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Routes
app.use('/api', predictRouter);

// Error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});