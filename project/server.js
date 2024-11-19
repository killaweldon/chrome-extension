import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Replicate from 'replicate';

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Prediction endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { image, prompt } = req.body;

    if (!image || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: image and prompt are required'
      });
    }

    // Run the prediction
    const output = await replicate.run(
      "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
      {
        input: {
          image,
          prompt,
          num_samples: "1",
          image_resolution: "512",
          ddim_steps: 20,
          scale: 9,
          seed: 1,
          eta: 0,
          a_prompt: "best quality, extremely detailed",
          n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality"
        }
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      res.json({
        success: true,
        prediction: output[0]
      });
    } else {
      throw new Error('No output generated from the model');
    }
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process the prediction',
      details: error.message
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});