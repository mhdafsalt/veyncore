import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    storeKey: {
      type: String,
      default: 'veyncore_main',
      unique: true,
    },
    whatsappNumber: {
      type: String,
      default: '919876543210',
      trim: true,
    },
    announcementText: {
      type: String,
      default: 'FREE SHIPPING ON ALL ORDERS ACROSS INDIA • DIRECT WHATSAPP CONCIERGE',
      trim: true,
    },
    supportEmail: {
      type: String,
      default: 'concierge@veyncore.com',
      trim: true,
    },
    vipDiscountPercent: {
      type: Number,
      default: 10,
    },
    isStoreOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

export default Setting;
