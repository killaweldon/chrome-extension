import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

const MODEL_VERSION = "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117";

export const createPrediction = async (image, prompt) => {
  try {
    // Create prediction
    const prediction = await replicate.predictions.create({
      version: MODEL_VERSION,
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
    });

    // Get prediction result
    let result = await replicate.predictions.get(prediction.id);
    
    // Poll until the prediction is complete
    while (result.status === "starting" || result.status === "processing") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === "failed") {
      throw new Error(result.error || 'Model prediction failed');
    }

    if (!result.output || !Array.isArray(result.output) || result.output.length === 0) {
      throw new Error('No output generated from the model');
    }

    return {
      success: true,
      prediction: result.output[0]
    };
  } catch (error) {
    console.error('Replicate service error:', error);
    throw error;
  }
};