import mongoose from 'mongoose';

/**
 * Order Schema for VEYNCORE
 * Persists orders generated via WhatsApp checkout modal and other checkout channels.
 * Maintains transactional consistency, address ledgers, and fulfillment tracking.
 */
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    productHandle: {
      type: String,
      trim: true,
      default: '',
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    color: {
      type: String,
      trim: true,
      default: 'Standard',
    },
    size: {
      type: String,
      trim: true,
      default: 'ONE SIZE',
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price must be positive'],
    },
    itemTotal: {
      type: Number,
      required: true,
      min: [0, 'Item total must be positive'],
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnail: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Customer phone is required'],
        trim: true,
        index: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: '',
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
    shippingAddress: {
      addressLine: {
        type: String,
        required: [true, 'Delivery address is required'],
        trim: true,
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        trim: true,
      },
      isKerala: {
        type: Boolean,
        default: false,
      },
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'Order must contain at least one product item',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal must be positive'],
    },
    discountCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount amount cannot be negative'],
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: [0, 'Shipping fee cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount must be positive'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: [
        'pending',
        'whatsapp_opened',
        'contacted',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'cod_pending', 'refunded'],
      default: 'unpaid',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['whatsapp_cod', 'whatsapp_upi', 'manual'],
      default: 'whatsapp_cod',
    },
    whatsappHandoffAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      trim: true,
      default: 'whatsapp_checkout',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
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

// Compound indexes for querying and admin filtering
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.phone': 1, createdAt: -1 });
orderSchema.index({ 'customer.userId': 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
