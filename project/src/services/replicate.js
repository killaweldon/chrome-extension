import Replicate from 'replicate';
import { config } from '../config/index.js';

// Initialize Replicate with the API token
const replicate = new Replicate({
  auth: config.replicateApiToken
});

// Log token presence (but not the actual token) for debugging
console.log('Replicate API Token configured:', !!config.replicateApiToken);

export const createPrediction = async (image, prompt) => {
  if (!config.replicateApiToken) {
    throw new Error('Replicate API token is not configured');
  }

  try {
    // Run the prediction using the simplified API
    const output = await replicate.run(
      "jagilley/controlnet-scribble:" + config.modelVersion,
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

    // The output is an array of image URLs, we take the first one
    if (output && output.length > 0) {
      return {
        success: true,
        prediction: output[0],
        status: 'succeeded'
      };
    }
    
    throw new Error('No output generated from the model');
  } catch (error) {
    // Enhanced error logging
    console.error('Replicate API Error:', {
      message: error.message,
      status: error.response?.status,
      details: error.response?.data
    });
    throw error;
  }
};