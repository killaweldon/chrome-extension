import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

export const createPrediction = async (image, prompt) => {
  try {
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

    const finalPrediction = await replicate.predictions.wait(prediction.id);
    
    if (finalPrediction.status === 'succeeded') {
      return {
        success: true,
        prediction: finalPrediction.output[0],
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