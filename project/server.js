import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import predictRouter from './src/routes/predict.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000; // Render expects port 10000 by default

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Routes
app.use('/api', predictRouter);

// Error handler
app.use(errorHandler);

// Bind to 0.0.0.0 to accept connections on all network interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});