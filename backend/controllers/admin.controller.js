import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Setting from '../models/setting.model.js';

// Initial default seed items if product collection is empty
const INITIAL_SEED_PRODUCTS = [
  {
    handle: 'vexo-blue-baggy',
    title: 'VEXO BLUE BAGGY',
    fit: 'Baggy Fit',
    category: 'VEYN-SELECTS',
    subCategory: 'BAGGY',
    badge: 'NEW',
    price: 1499,
    comparePrice: 1700,
    images: ['/images/products/vexo-blue-baggy.jpg', '/images/products/artic-blue-wide.jpg'],
    thumbnail: '/images/products/vexo-blue-baggy.jpg',
    availableSizes: ['28', '30', '32', '34', '36'],
    description: 'Raw wash heavyweight denim with oversized wide leg silhouette.',
    inStock: true,
  },
  {
    handle: 'tinted-blue-wide',
    title: 'TINTED BLUE WIDE',
    fit: 'Wide Fit',
    category: 'VEYN-SELECTS',
    subCategory: 'WIDE',
    badge: 'SALE',
    price: 1499,
    comparePrice: 1700,
    images: ['/images/products/tinted-blue-wide.jpg', '/images/products/artic-blue-wide.jpg'],
    thumbnail: '/images/products/tinted-blue-wide.jpg',
    availableSizes: ['28', '30', '32', '34'],
    description: 'Sun-faded tinted wash tailored with signature VEYNCORE loose draping.',
    inStock: true,
  },
  {
    handle: 'nid-blue-wide',
    title: 'NID BLUE WIDE',
    fit: 'Wide Fit',
    category: 'VEYN-SELECTS',
    subCategory: 'WIDE',
    badge: 'BESTSELLER',
    price: 1499,
    comparePrice: 1700,
    images: ['/images/products/nid-blue-wide.jpg'],
    thumbnail: '/images/products/nid-blue-wide.jpg',
    availableSizes: ['30', '32', '34', '36'],
    description: 'Ice stone washed custom denim with heavy distressed wash treatment.',
    inStock: true,
  },
  {
    handle: 'coal-blue-baggy',
    title: 'COAL BLUE BAGGY',
    fit: 'Baggy Fit',
    category: 'VEYN-SELECTS',
    subCategory: 'BAGGY',
    badge: 'MUST HAVE',
    price: 1499,
    comparePrice: 1700,
    images: ['/images/products/coal-blue-baggy.jpg'],
    thumbnail: '/images/products/coal-blue-baggy.jpg',
    availableSizes: ['28', '30', '32', '34'],
    description: 'Charcoal undertone deep indigo raw denim engineered for stacked hems.',
    inStock: true,
  },
  {
    handle: 'tactical-cargo-sling',
    title: 'TACTICAL CARGO SLING',
    fit: 'One Size',
    category: 'VEYN-OBJECTS',
    subCategory: 'BAGS',
    badge: 'OBJECTS LAB',
    price: 1899,
    comparePrice: 2299,
    images: ['/images/hero/hero-card-3.jpg'],
    thumbnail: '/images/hero/hero-card-3.jpg',
    availableSizes: ['ONE SIZE'],
    description: 'Military-grade ballistic nylon crossbody bag with modular carabiners.',
    isObject: true,
    inStock: true,
  },
];

// Initial mock orders to provide immediate dynamic visual data if empty
const INITIAL_SEED_ORDERS = [
  {
    orderNumber: 'VC-89211',
    customerName: 'Afsal Mohammed',
    customerEmail: 'afsal@example.com',
    customerPhone: '9995917332',
    totalAmount: 1499,
    status: 'Pending',
    paymentMethod: 'WhatsApp Direct / UPI',
    items: [
      {
        productId: 'vexo-blue-baggy',
        title: 'VEXO BLUE BAGGY',
        size: '32',
        quantity: 1,
        price: 1499,
        image: '/images/products/vexo-blue-baggy.jpg',
      },
    ],
  },
  {
    orderNumber: 'VC-89210',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.v@gmail.com',
    customerPhone: '9845012345',
    totalAmount: 2998,
    status: 'Shipped',
    paymentMethod: 'WhatsApp Direct',
    items: [
      {
        productId: 'tinted-blue-wide',
        title: 'TINTED BLUE WIDE',
        size: '30',
        quantity: 2,
        price: 1499,
        image: '/images/products/tinted-blue-wide.jpg',
      },
    ],
  },
];

/**
 * GET /api/admin/overview
 * Comprehensive dashboard metrics across users, products, orders, and revenue
 */
export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const vipUsers = await User.countDocuments({ vipNotifications: true });
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Auto-seed initial products if empty so dashboard is immediately functional
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(INITIAL_SEED_PRODUCTS);
    }

    // Auto-seed initial orders if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.insertMany(INITIAL_SEED_ORDERS);
    }

    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const outOfStockProducts = totalProducts - inStockProducts;

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    // Aggregate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent 5 users & 5 orders
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(6);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);

    return res.status(200).json({
      success: true,
      message: 'Admin metrics retrieved successfully.',
      data: {
        totalUsers,
        vipUsers,
        adminCount,
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        totalOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue,
        recentUsers,
        recentOrders,
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

/* ==========================================================================
   USER MANAGEMENT CONTROLLERS
   ========================================================================== */

export const getAllUsers = async (req, res) => {
  try {
    const { q, role, vip } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { mobileNumber: { $regex: q, $options: 'i' } },
      ];
    }
    if (role && role !== 'all') {
      filter.role = role;
    }
    if (vip === 'true') {
      filter.vipNotifications = true;
    } else if (vip === 'false') {
      filter.vipNotifications = false;
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

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

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role value. Must be 'user' or 'admin'.",
      });
    }

    // Protect against self-demotion
    if (req.user && req.user._id.toString() === id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove admin privileges from your own active account.',
      });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully.`,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserVip = async (req, res) => {
  try {
    const { id } = req.params;
    const { vipNotifications } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { vipNotifications: Boolean(vipNotifications) },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'VIP status updated.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own active administrator account.',
      });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================================================
   PRODUCT MANAGEMENT CONTROLLERS
   ========================================================================== */

export const getAllProducts = async (req, res) => {
  try {
    const { q, category, inStock } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { handle: { $regex: q, $options: 'i' } },
        { subCategory: { $regex: q, $options: 'i' } },
      ];
    }
    if (category && category !== 'ALL') {
      filter.category = category;
    }
    if (inStock === 'true') {
      filter.inStock = true;
    } else if (inStock === 'false') {
      filter.inStock = false;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      handle,
      price,
      comparePrice,
      category,
      subCategory,
      badge,
      availableSizes,
      description,
      images,
      inStock,
      isObject,
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title and numeric price are required.',
      });
    }

    const generatedHandle =
      handle ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const existing = await Product.findOne({ handle: generatedHandle });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Product handle '${generatedHandle}' already exists. Please choose a unique title.`,
      });
    }

    const numPrice = Number(price);
    const numCompare = comparePrice ? Number(comparePrice) : null;

    const product = new Product({
      title,
      handle: generatedHandle,
      price: numPrice,
      comparePrice: numCompare,
      salePrice: `Rs. ${numPrice.toLocaleString('en-IN')}.00`,
      regularPrice: numCompare ? `Rs. ${numCompare.toLocaleString('en-IN')}.00` : '',
      category: category || 'VEYN-SELECTS',
      subCategory: subCategory || 'BAGGY',
      badge: badge || '',
      availableSizes: Array.isArray(availableSizes)
        ? availableSizes
        : availableSizes
        ? availableSizes.split(',').map((s) => s.trim())
        : ['28', '30', '32', '34', '36'],
      description: description || '',
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/products/artic-blue-wide.jpg'],
      thumbnail: Array.isArray(images) && images.length > 0 ? images[0] : '/images/products/artic-blue-wide.jpg',
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      isObject: Boolean(isObject || category === 'VEYN-OBJECTS'),
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
      updates.salePrice = `Rs. ${updates.price.toLocaleString('en-IN')}.00`;
    }
    if (updates.comparePrice !== undefined) {
      updates.comparePrice = updates.comparePrice ? Number(updates.comparePrice) : null;
      if (updates.comparePrice) {
        updates.regularPrice = `Rs. ${updates.comparePrice.toLocaleString('en-IN')}.00`;
      } else {
        updates.regularPrice = '';
      }
    }

    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product removed from catalog.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(INITIAL_SEED_PRODUCTS);
    return res.status(200).json({
      success: true,
      message: `Database populated with ${inserted.length} catalog products.`,
      data: inserted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================================================
   ORDER MANAGEMENT CONTROLLERS
   ========================================================================== */

export const getAllOrders = async (req, res) => {
  try {
    const { q, status } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { orderNumber: { $regex: q, $options: 'i' } },
        { customerName: { $regex: q, $options: 'i' } },
        { customerPhone: { $regex: q, $options: 'i' } },
      ];
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, totalAmount, notes } = req.body;

    if (!customerName || !customerPhone || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, phone, and total amount are required.',
      });
    }

    const orderNumber = `VC-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = new Order({
      orderNumber,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      items: items || [],
      totalAmount: Number(totalAmount),
      notes: notes || '',
      status: 'Pending',
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Choose from: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Order status set to '${status}'.`,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order record deleted.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================================================
   STORE SETTINGS CONTROLLER
   ========================================================================== */

export const getStoreSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ storeKey: 'veyncore_main' });
    if (!settings) {
      settings = await Setting.create({ storeKey: 'veyncore_main' });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStoreSettings = async (req, res) => {
  try {
    const updates = req.body;
    let settings = await Setting.findOneAndUpdate(
      { storeKey: 'veyncore_main' },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Store settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  updateUserVip,
  deleteUser,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getStoreSettings,
  updateStoreSettings,
};
