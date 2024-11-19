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

    // Validate image format
    const isValidImageUrl = image.startsWith('http') || image.startsWith('data:image/');
    if (!isValidImageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image must be a valid URL or data URL'
      });
    }

    // Create prediction
    const prediction = await replicate.predictions.create({
      version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
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
    });

    // Wait for the prediction to complete
    const finalPrediction = await replicate.predictions.wait(prediction.id);
    
    if (finalPrediction.status === 'succeeded') {
      res.json({
        success: true,
        output: finalPrediction.output,
        status: finalPrediction.status,
        created_at: finalPrediction.created_at,
        completed_at: finalPrediction.completed_at
      });
    } else if (finalPrediction.status === 'failed') {
      throw new Error(finalPrediction.error || 'Prediction failed');
    } else {
      throw new Error(`Unexpected status: ${finalPrediction.status}`);
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

  if (err.response?.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API token',
      details: 'Please check your Replicate API token'
    });
  }

  if (err.response?.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      details: 'Please try again later'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    details: err.message
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});