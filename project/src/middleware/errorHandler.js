export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle specific API errors
  if (err.response?.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API token',
      details: 'Please check your Replicate API token'
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
    error: 'Something went wrong!',
    details: err.message
  });
};