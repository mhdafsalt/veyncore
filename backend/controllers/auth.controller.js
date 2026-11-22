import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'veyncore_syndicate_secret_jwt_key_2026_super_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a JWT token containing user ID and role
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

/**
 * POST /api/auth/register
 * Registers a new user with default role: "user"
 */
export const register = async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      mobileNumber,
      phone,
      password,
      vipNotifications,
      subscribeNewsletter,
    } = req.body || {};

    // 1. Resolve and sanitize input fields
    const resolvedName = (name || fullName || '').trim();
    const resolvedEmail = (email || '').toLowerCase().trim();
    const resolvedMobile = (mobileNumber || phone || '').trim();
    const resolvedVip =
      typeof vipNotifications === 'boolean'
        ? vipNotifications
        : Boolean(subscribeNewsletter);

    // 2. Validate Full Name
    if (!resolvedName) {
      return res.status(400).json({
        success: false,
        message: 'Full Name is required.',
      });
    }

    // 3. Validate Email
    if (!resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resolvedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // 4. Validate Password
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // 5. Prevent duplicate email registration
    const existingUser = await User.findOne({ email: resolvedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.',
      });
    }

    // 6. Create user with STRICT role: "user" (Ignore any role sent by frontend)
    const newUser = new User({
      name: resolvedName,
      email: resolvedEmail,
      mobileNumber: resolvedMobile,
      password,
      role: 'user', // Enforce immutable role assignment
      vipNotifications: resolvedVip,
    });

    await newUser.save();

    // 7. Generate JWT token
    const token = generateToken(newUser);

    // 8. Return response
    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
        role: newUser.role,
        vipNotifications: newUser.vipNotifications,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth Error] Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create account. Please try again.',
    });
  }
};

/**
 * POST /api/auth/login
 * Authenticates user via email & password and returns verified role
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const resolvedEmail = (email || '').toLowerCase().trim();

    if (!resolvedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Both email address and password are required.',
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email: resolvedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify hashed password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        vipNotifications: user.vipNotifications,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth Error] Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Login failed due to a server error.',
    });
  }
};

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        mobileNumber: req.user.mobileNumber,
        role: req.user.role,
        vipNotifications: req.user.vipNotifications,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth Error] GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.',
    });
  }
};

export default {
  register,
  login,
  getMe,
};
