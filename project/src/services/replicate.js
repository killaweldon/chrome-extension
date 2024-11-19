import Replicate from 'replicate';
import { config } from '../config/index.js';

const replicate = new Replicate({
  auth: config.replicateApiToken
});

export const createPrediction = async (image, prompt) => {
  try {
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

    if (!Array.isArray(output) || output.length === 0) {
      throw new Error('No output generated from the model');
    }

    return {
      success: true,
      prediction: output[0]
    };
  } catch (error) {
    console.error('Replicate service error:', error);
    throw error;
  }
};