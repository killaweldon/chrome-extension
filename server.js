import express from 'express';
import cors from 'cors';
import { config } from './src/config/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import predictRouter from './src/routes/predict.js';

const app = express();

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

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});