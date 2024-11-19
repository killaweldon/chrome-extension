import Replicate from 'replicate';
import { config } from '../config/index.js';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

export const createPrediction = async (image, prompt) => {
  try {
    // Run the model directly using replicate.run()
    const output = await replicate.run(
      `${config.modelId}:${config.modelVersion}`,
      {
        input: {
          image,
          prompt,
          num_samples: "1",
          image_resolution: "512",
          ddim_steps: 20,
          scale: 9,
          seed: Math.floor(Math.random() * 1000000),
          eta: 0,
          a_prompt: "best quality, extremely detailed",
          n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality"
        }
      }
    );

    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new Error('No output generated from the model');
    }

    return {
      success: true,
      prediction: output[0] // Return the first generated image URL
    };
  } catch (error) {
    console.error('Replicate service error:', error);
    throw error;
  }
};