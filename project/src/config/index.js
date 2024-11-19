import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  replicateApiToken: process.env.REPLICATE_API_TOKEN,
  modelVersion: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 300000
};