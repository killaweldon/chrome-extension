export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    status: err.response?.status,
    details: err.response?.data
  });

  // Handle specific API errors
  if (err.response?.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed with Replicate API',
      details: 'Please check the API token configuration'
    });
  }

  if (err.response?.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      details: 'Please try again later'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};