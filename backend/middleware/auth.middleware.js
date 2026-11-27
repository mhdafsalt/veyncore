import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * Authentication Middleware
 * Validates JWT from Authorization Bearer header and attaches req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to continue.',
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[Auth Middleware] Critical configuration error: JWT_SECRET environment variable is missing.');
      return res.status(500).json({
        success: false,
        message: 'Authentication service configuration error. Please contact administrator.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid. Please sign in again.',
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user account associated with this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to internal server error.',
    });
  }
};

/**
 * Admin Authorization Middleware
 * Strictly enforces that req.user has role === 'admin'
 * Returns 403 Forbidden for unauthorized requests
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required before checking admin authorization.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required.',
    });
  }

  next();
};

export default {
  authenticate,
  requireAdmin,
};
