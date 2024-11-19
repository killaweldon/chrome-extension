import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate API token format
const validateApiToken = (token) => {
  if (!token) return null;
  // Extract just the token value, removing any prefix
  const tokenMatch = token.match(/^(?:r8_|REPLICATE_API_TOKEN=)?(.*)/);
  return tokenMatch ? tokenMatch[1] : token;
};

export const config = {
  port: process.env.PORT || 3000,
  replicateApiToken: validateApiToken(process.env.REPLICATE_API_TOKEN),
  modelVersion: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 300000
};