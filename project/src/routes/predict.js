import express from 'express';
import { createPrediction } from '../services/replicate.js';

const router = express.Router();

router.post('/predict', async (req, res) => {
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

    const result = await createPrediction(image, prompt);
    res.json(result); // Send the complete result object
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process the prediction',
      details: error.message
    });
  }
});

export default router;