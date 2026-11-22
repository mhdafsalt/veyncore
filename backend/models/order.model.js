import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '32',
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required.'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      default: '',
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer contact phone is required.'],
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'WhatsApp Direct / UPI',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
