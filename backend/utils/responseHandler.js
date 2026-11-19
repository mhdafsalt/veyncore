/**
 * Standard API Response Formatter Utility
 */
export const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

export const sendError = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

export default {
  sendSuccess,
  sendError,
};
