import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    console.log('Starting prediction with prompt:', prompt);

    const output = await replicate.run(
      "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
      {
        input: {
          image: image,
          prompt: prompt,
          num_samples: "1",
          image_resolution: "512",
          ddim_steps: 20,
          scale: 9,
          a_prompt: "best quality, extremely detailed",
          n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality"
        }
      }
    );

    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new Error('No output generated from the model');
    }

    res.json({
      success: true,
      prediction: output[0]
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process the prediction',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});