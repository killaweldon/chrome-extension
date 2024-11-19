// API configuration
const API_BASE_URL = 'https://scribble-ai.onrender.com'; // Replace with your Render URL

// API client for making requests to the backend
const api = {
  // Health check
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/healthz`);
    return response.ok;
  },

  // Make prediction using Replicate API
  async predict({ model, version, input }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          version,
          input,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Prediction failed');
      }

      const data = await response.json();
      return data.prediction;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default api;