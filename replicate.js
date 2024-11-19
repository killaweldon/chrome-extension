import Replicate from 'replicate';
import { config } from '../config/index.js';

const replicate = new Replicate({
  auth: config.replicateApiToken,
});

export const createPrediction = async (image, prompt) => {
  try {
    // Create the prediction
    const prediction = await replicate.predictions.create({
      version: config.modelVersion,
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
      },
      webhook: process.env.WEBHOOK_URL, // Optional: Add if you have a webhook endpoint
      webhook_events_filter: ["completed"] // Only notify when prediction is complete
    });

    // Wait for the prediction to complete
    const finalPrediction = await replicate.predictions.wait(prediction.id);
    
    if (finalPrediction.status === 'succeeded') {
      return finalPrediction;
    } else if (finalPrediction.status === 'failed') {
      throw new Error(finalPrediction.error || 'Prediction failed');
    } else {
      throw new Error(`Unexpected status: ${finalPrediction.status}`);
    }
  } catch (error) {
    console.error('Replicate API Error:', error);
    throw error;
  }
};