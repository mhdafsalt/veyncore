import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import WhatsAppClick from '../models/whatsappClick.model.js';
import LaunchSale from '../models/launchSale.model.js';
import Order from '../models/order.model.js';

/**
 * GET /api/admin/overview
 * Protected route for admin overview metrics
 */
export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const vipUsers = await User.countDocuments({ vipNotifications: true });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const totalProducts = await Product.countDocuments();
    const selectsCount = await Product.countDocuments({ category: 'VEYN-SELECTS' });
    const objectsCount = await Product.countDocuments({ category: 'VEYN-OBJECTS' });

    let launchSalesCount = 0;
    try {
      launchSalesCount = await LaunchSale.countDocuments();
    } catch (saleErr) {
      console.warn('[Admin Overview] Failed to fetch LaunchSale count:', saleErr.message);
    }

    // Order counts and analytics
    let totalOrders = 0;
    let pendingOrders = 0;
    let confirmedOrders = 0;
    let totalRevenue = 0;
    try {
      totalOrders = await Order.countDocuments();
      pendingOrders = await Order.countDocuments({ status: { $in: ['pending', 'whatsapp_opened'] } });
      confirmedOrders = await Order.countDocuments({
        status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
      });
      const revenueAgg = await Order.aggregate([
        { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);
      totalRevenue = revenueAgg[0]?.total || 0;
    } catch (orderErr) {
      console.warn('[Admin Overview] Failed to fetch order counts:', orderErr.message);
    }

    // WhatsApp Click Count
    let whatsappClicks = 0;
    let recentWhatsAppClicks = [];
    try {
      whatsappClicks = await WhatsAppClick.countDocuments();
      recentWhatsAppClicks = await WhatsAppClick.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    } catch (clickErr) {
      console.warn('[Admin Overview] Failed to fetch WhatsApp click counts:', clickErr.message);
    }

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
        totalProducts,
        selectsCount,
        objectsCount,
        launchSalesCount,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        totalRevenue,
        whatsappClicks,
        recentWhatsAppClicks,
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
