// API Manager Module
class ApiManager {
  constructor() {
    this.baseUrl = 'https://scribble-ai.onrender.com';
    this.isHealthy = true;
    this.startHealthCheck();
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`);
      this.isHealthy = response.ok;
      return this.isHealthy;
    } catch (error) {
      this.isHealthy = false;
      return false;
    }
  }

  startHealthCheck() {
    this.checkHealth();
    setInterval(() => this.checkHealth(), 30000);
  }

  async generateImage(imageData, prompt) {
    if (!this.isHealthy) {
      throw new Error('API is currently unavailable');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          image: imageData,
          prompt: prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process the prediction');
      }

      // Return the prediction URL directly
      return result.prediction;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default new ApiManager();