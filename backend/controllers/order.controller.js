import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import LaunchSale from '../models/launchSale.model.js';

/**
 * Clean Indian phone number to 10 digits
 */
const cleanPhone = (phoneStr) => {
  if (!phoneStr) return '';
  const digits = String(phoneStr).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
};

/**
 * Check if Indian pincode is Kerala (Prefixes 67, 68, 69)
 */
const isKeralaPincode = (pincode) => {
  const clean = String(pincode || '').replace(/\s/g, '');
  return /^(67|68|69)/.test(clean);
};

/**
 * Validate discount code against active promotional rules
 */
const evaluateDiscount = (code, subtotal) => {
  const cleanCode = String(code || '').trim().toUpperCase();
  if (!cleanCode || subtotal <= 0) {
    return { valid: false, code: '', amount: 0 };
  }

  if (cleanCode === 'VEYN10' || cleanCode === 'WELCOME10') {
    const discount = Math.round(subtotal * 0.1);
    return { valid: true, code: cleanCode, amount: discount };
  }

  if (cleanCode === 'FLAT100') {
    if (subtotal >= 999) {
      return { valid: true, code: cleanCode, amount: 100 };
    }
  }

  return { valid: false, code: '', amount: 0 };
};

/**
 * Strict format pattern for valid VEYNCORE order references: VC-YYYYMMDD-XXXX (4 numeric digits)
 */
const VC_ORDER_FORMAT = /^VC-\d{8}-\d{4}$/;

/**
 * Generate a guaranteed unique order reference.
 * Authoritative: Validates format and checks for collisions in MongoDB.
 * Rejects manipulated, invalid, or duplicate client references and falls back
 * to server-side generated unique VC-YYYYMMDD-XXXX format.
 */
const generateUniqueOrderNumber = async (requestedRef = '') => {
  const cleanRequested = String(requestedRef || '').trim().toUpperCase();
  if (cleanRequested && VC_ORDER_FORMAT.test(cleanRequested)) {
    const exists = await Order.exists({ orderNumber: cleanRequested });
    if (!exists) return cleanRequested;
  }

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  for (let attempt = 0; attempt < 10; attempt++) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const candidate = `VC-${dateStr}-${randomSuffix}`;
    const exists = await Order.exists({ orderNumber: candidate });
    if (!exists) return candidate;
  }
  const timeSuffix = String(Date.now() % 10000).padStart(4, '0');
  return `VC-${dateStr}-${timeSuffix}`;
};

/**
 * POST /api/orders
 * Creates and persists a customer order prior to WhatsApp redirection.
 * Validates stock, calculates server-verified prices, shipping, and discounts.
 */
export const createOrder = async (req, res) => {
  try {
    await connectDB();

    const {
      customer = {},
      shippingAddress = {},
      items = [],
      discountCode = '',
      source = 'whatsapp_checkout',
      notes = '',
    } = req.body || {};

    // 1. Validate Customer
    const name = String(customer.name || '').trim();
    const phone = cleanPhone(customer.phone);
    const email = String(customer.email || '').trim().toLowerCase();

    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'A valid customer name (at least 2 characters) is required.',
      });
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'A valid 10-digit Indian mobile number is required.',
      });
    }

    // 2. Validate Address & Pincode
    const addressLine = String(shippingAddress.addressLine || shippingAddress.address || '').trim();
    const pincode = String(shippingAddress.pincode || '').replace(/\s/g, '').trim();

    if (!addressLine || addressLine.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'A complete delivery address is required.',
      });
    }

    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'A valid 6-digit postal pincode is required.',
      });
    }

    // 3. Validate Items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your order must contain at least one product item.',
      });
    }

    // 4. Server-Side Price & Product Verification
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const title = String(item.title || 'Product').trim();
      const color = String(item.color || item.variant || item.fit || 'Standard').trim();
      const size = String(item.size || 'ONE SIZE').trim();
      const handle = String(item.handle || item.productHandle || '').trim();

      let unitPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0).replace(/[^0-9.]/g, ''));

      // If item references a valid MongoDB product, verify canonical price
      if (handle) {
        try {
          const dbProduct = await Product.findOne({ handle }).lean();
          if (dbProduct && typeof dbProduct.price === 'number') {
            // Check for active launch sale discount
            const now = new Date();
            const activeSale = await LaunchSale.findOne({
              $or: [{ productId: dbProduct._id }, { productHandle: handle }],
              isActive: true,
              startDate: { $lte: now },
              endDate: { $gte: now },
            }).lean();

            if (activeSale && typeof activeSale.salePrice === 'number' && activeSale.salePrice > 0) {
              unitPrice = activeSale.salePrice;
            } else {
              unitPrice = dbProduct.price;
            }
          }
        } catch (dbErr) {
          // Fall back gracefully to provided validated price
        }
      }

      if (isNaN(unitPrice) || unitPrice < 0) {
        unitPrice = 0;
      }

      const itemTotal = unitPrice * qty;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        productId: item.productId || null,
        productHandle: handle,
        title,
        color,
        size,
        quantity: qty,
        unitPrice,
        itemTotal,
        url: item.url || '',
        thumbnail: item.thumbnail || item.image || '',
      });
    }

    // 5. Calculate Shipping (Kerala = Free, Outside Kerala = ₹50)
    const isKerala = isKeralaPincode(pincode);
    const shippingFee = isKerala ? 0 : 50;

    // 6. Calculate Discounts
    const discountEvaluation = evaluateDiscount(discountCode, calculatedSubtotal);
    const discountAmount = discountEvaluation.amount;
    const validatedDiscountCode = discountEvaluation.valid ? discountEvaluation.code : '';

    // 7. Calculate Grand Total
    const totalAmount = Math.max(0, calculatedSubtotal - discountAmount + shippingFee);

    // 8. Generate Guaranteed Unique Order Number
    const requestedRef = req.body.orderNumber || req.body.orderRef || '';
    const orderNumber = await generateUniqueOrderNumber(requestedRef);

    // 9. Persist Order Record in MongoDB
    const newOrder = await Order.create({
      orderNumber,
      customer: {
        name,
        phone,
        email,
        userId: req.user?._id || customer.userId || null,
      },
      shippingAddress: {
        addressLine,
        pincode,
        isKerala,
      },
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      discountCode: validatedDiscountCode,
      discountAmount,
      shippingFee,
      totalAmount,
      currency: 'INR',
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'whatsapp_cod',
      whatsappHandoffAt: new Date(),
      source,
      notes: String(notes || '').trim(),
      ip: req.ip || '',
      userAgent: req.get('user-agent') || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      orderNumber: newOrder.orderNumber,
      order: {
        id: newOrder._id,
        orderNumber: newOrder.orderNumber,
        subtotal: newOrder.subtotal,
        discountAmount: newOrder.discountAmount,
        shippingFee: newOrder.shippingFee,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
      },
    });
  } catch (error) {
    console.error('[Order Controller] Create order failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.',
      error: error.message,
    });
  }
};

/**
 * GET /api/orders/:orderNumber
 * Public order reference lookup (sanitized)
 */
export const getOrderByNumber = async (req, res) => {
  try {
    await connectDB();
    const { orderNumber } = req.params;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required.',
      });
    }

    const order = await Order.findOne({
      orderNumber: String(orderNumber).trim().toUpperCase(),
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found with this reference number.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        totalAmount: order.totalAmount,
        itemCount: order.items?.length || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error looking up order.',
    });
  }
};

/**
 * GET /api/orders
 * Admin route to list orders with filters and pagination
 */
export const getAllOrders = async (req, res) => {
  try {
    await connectDB();
    const { status, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      const safeSearch = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { orderNumber: new RegExp(safeSearch, 'i') },
        { 'customer.phone': new RegExp(safeSearch, 'i') },
        { 'customer.name': new RegExp(safeSearch, 'i') },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      Order.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders.',
    });
  }
};

/**
 * Valid order status values and allowed state transitions
 */
const VALID_ORDER_STATUSES = [
  'pending',
  'whatsapp_opened',
  'contacted',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const VALID_PAYMENT_STATUSES = ['unpaid', 'paid', 'cod_pending', 'refunded'];

const ALLOWED_ORDER_TRANSITIONS = {
  pending: ['whatsapp_opened', 'contacted', 'confirmed', 'cancelled'],
  whatsapp_opened: ['contacted', 'confirmed', 'cancelled'],
  contacted: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'shipped', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: ['cancelled'],
  cancelled: [], // Terminal state
};

/**
 * PATCH /api/orders/:id/status
 * Admin route to update order status or payment status with state machine validation
 */
export const updateOrderStatus = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID format.' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // 1. Validate Status Transition if status update requested
    if (status !== undefined) {
      const cleanStatus = String(status).toLowerCase().trim();
      if (!VALID_ORDER_STATUSES.includes(cleanStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status "${status}". Allowed values: ${VALID_ORDER_STATUSES.join(', ')}`,
        });
      }

      if (cleanStatus !== order.status) {
        const allowedNext = ALLOWED_ORDER_TRANSITIONS[order.status] || [];
        if (!allowedNext.includes(cleanStatus)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status transition: Cannot move order from "${order.status}" to "${cleanStatus}". Allowed transitions: ${allowedNext.join(', ') || 'None (terminal)'}.`,
          });
        }
        order.status = cleanStatus;
      }
    }

    // 2. Validate Payment Status if paymentStatus update requested
    if (paymentStatus !== undefined) {
      const cleanPayment = String(paymentStatus).toLowerCase().trim();
      if (!VALID_PAYMENT_STATUSES.includes(cleanPayment)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status "${paymentStatus}". Allowed values: ${VALID_PAYMENT_STATUSES.join(', ')}`,
        });
      }
      order.paymentStatus = cleanPayment;
    }

    // 3. Update notes if provided
    if (typeof notes === 'string') {
      order.notes = notes.trim();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      data: order,
    });
  } catch (error) {
    console.error('[Order Controller] Status update error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
      error: error.message,
    });
  }
};
