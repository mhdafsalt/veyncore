/**
 * 404 Not Found Middleware
 * Handles all requests targeting routes that do not exist
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
};

export default notFoundHandler;
