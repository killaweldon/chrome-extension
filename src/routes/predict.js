import express from 'express';
import { createPrediction } from '../services/replicate.js';

const router = express.Router();

router.post('/predict', async (req, res, next) => {
  try {
    const { image, prompt } = req.body;

    if (!image || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: image and prompt are required'
      });
    }

    const result = await createPrediction(image, prompt);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;