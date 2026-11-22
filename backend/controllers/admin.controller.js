import User from '../models/user.model.js';

/**
 * GET /api/admin/overview
 * Protected route for admin overview metrics
 */
export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const vipUsers = await User.countDocuments({ vipNotifications: true });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: 'Admin metrics retrieved successfully.',
      data: {
        totalUsers,
        vipUsers,
        adminCount,
        recentUsers,
      },
    });
  } catch (error) {
    console.error('[Admin Error] Overview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin overview.',
    });
  }
};

/**
 * GET /api/admin/users
 * Returns list of all registered users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('[Admin Error] Users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users.',
    });
  }
};

export default {
  getAdminOverview,
  getAllUsers,
};
