export const errorHandler = (err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  if (err.response?.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      details: 'Invalid or missing API token'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Failed to process the prediction',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
};