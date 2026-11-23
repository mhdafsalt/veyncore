import mongoose from 'mongoose';

/**
 * WhatsApp Click / Order Tracking Schema
 * Tracks every time a user clicks the "Direct WhatsApp Order" button
 * across the product page, cart drawer, and quick-buy drawer.
 */
const whatsappClickSchema = new mongoose.Schema(
  {
    productHandle: {
      type: String,
      default: '',
      trim: true,
    },
    productTitle: {
      type: String,
      default: 'Product',
      trim: true,
    },
    size: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    source: {
      type: String,
      enum: ['product_detail', 'cart_drawer', 'quick_buy', 'other'],
      default: 'product_detail',
    },
    userEmail: {
      type: String,
      default: '',
      trim: true,
    },
    userPhone: {
      type: String,
      default: '',
      trim: true,
    },
    ip: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index on createdAt for fast sorting and metrics retrieval
whatsappClickSchema.index({ createdAt: -1 });

const WhatsAppClick =
  mongoose.models.WhatsAppClick ||
  mongoose.model('WhatsAppClick', whatsappClickSchema);

export default WhatsAppClick;
