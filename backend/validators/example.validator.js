/**
 * Starter Request Validator Utility / Middleware
 */
export const validateExampleInput = (req, res, next) => {
  const { title } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Title is required and cannot be empty',
    });
  }

  next();
};

export default {
  validateExampleInput,
};
