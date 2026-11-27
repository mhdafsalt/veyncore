/**
 * Global Error Handling Middleware
 * Catches unhandled errors across routes and controllers,
 * sanitizes production errors, and maps Mongoose errors to appropriate HTTP codes.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Map Mongoose Validation Errors to 400 Bad Request
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors || {})
      .map((e) => e.message)
      .join(', ') || 'Validation Error';
  }

  // Map Duplicate Key Errors to 409 Conflict
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateFields = Object.keys(err.keyValue || {}).join(', ');
    message = `A record with this ${duplicateFields || 'value'} already exists.`;
  }

  // Map Invalid ObjectId Cast Errors to 400 Bad Request
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field ${err.path || 'identifier'}.`;
  }

  console.error(`[Error] ${req.method} ${req.originalUrl} (${statusCode}):`, message);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
