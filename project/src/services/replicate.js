import Replicate from 'replicate';
import { config } from '../config/index.js';

const replicate = new Replicate({
  auth: config.replicateApiToken,
});

export const createPrediction = async (image, prompt) => {
  try {
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
      }
    });

    const finalPrediction = await replicate.predictions.wait(prediction.id);
    
    if (finalPrediction.status === 'succeeded') {
      return {
        success: true,
        prediction: finalPrediction.output[0], // Return the first generated image URL
        status: finalPrediction.status,
        created_at: finalPrediction.created_at,
        completed_at: finalPrediction.completed_at
      };
    }
    
    throw new Error(finalPrediction.error || 'Prediction failed');
  } catch (error) {
    console.error('Replicate API Error:', error);
    throw error;
  }
};