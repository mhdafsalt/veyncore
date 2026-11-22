import { Router } from 'express';
import Setting from '../models/setting.model.js';

const router = Router();

// Public endpoint to read store configuration
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne({ storeKey: 'veyncore_main' });
    if (!settings) {
      settings = await Setting.create({ storeKey: 'veyncore_main' });
    }
    return res.status(200).json({
      success: true,
      data: {
        whatsappNumber: settings.whatsappNumber,
        announcementText: settings.announcementText,
        supportEmail: settings.supportEmail,
        vipDiscountPercent: settings.vipDiscountPercent,
        isStoreOpen: settings.isStoreOpen,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
