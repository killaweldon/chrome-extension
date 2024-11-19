import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Endpoint for Replicate API predictions
app.post('/api/predict', async (req, res) => {
  try {
    const { model, version, input } = req.body;

    if (!model || !version || !input) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: model, version, and input are required'
      });
    }

    const prediction = await replicate.run(
      `${model}/${version}`,
      { input }
    );

    res.json({ success: true, prediction });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process the prediction',
      details: error.message
    });
  }
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    details: err.message
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});