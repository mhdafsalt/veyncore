import WhatsAppClick from '../models/whatsappClick.model.js';

/**
 * POST /api/analytics/whatsapp-click
 * Public endpoint to track when a customer clicks "Direct WhatsApp Order".
 */
export const trackWhatsAppClick = async (req, res) => {
  try {
    const {
      productHandle = '',
      productTitle = 'Product',
      size = '',
      price = 0,
      quantity = 1,
      source = 'product_detail',
      userEmail = '',
      userPhone = '',
    } = req.body || {};

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '';
    const userAgent = req.headers['user-agent'] || '';

    const clickRecord = new WhatsAppClick({
      productHandle,
      productTitle,
      size,
      price: Number(price) || 0,
      quantity: Number(quantity) || 1,
      source,
      userEmail,
      userPhone,
      ip,
      userAgent,
    });

    await clickRecord.save();

    return res.status(201).json({
      success: true,
      message: 'WhatsApp click recorded successfully.',
      data: { id: clickRecord._id },
    });
  } catch (error) {
    console.error('[Analytics Error] Track WhatsApp click failed:', error);
    // Non-blocking fail-safe: return 200 or 500 without breaking client UX
    return res.status(500).json({
      success: false,
      message: 'Failed to record WhatsApp click.',
    });
  }
};

/**
 * GET /api/analytics/whatsapp-clicks
 * Protected admin endpoint to fetch logged WhatsApp clicks.
 */
export const getWhatsAppClicks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const [totalClicks, clicks] = await Promise.all([
      WhatsAppClick.countDocuments(),
      WhatsAppClick.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalClicks,
        page,
        limit,
        clicks,
      },
    });
  } catch (error) {
    console.error('[Analytics Error] Get WhatsApp clicks failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve WhatsApp clicks.',
    });
  }
};

export default {
  trackWhatsAppClick,
  getWhatsAppClicks,
};
