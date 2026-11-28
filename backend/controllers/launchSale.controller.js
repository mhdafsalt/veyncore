import mongoose from 'mongoose';
import LaunchSale from '../models/launchSale.model.js';
import Product from '../models/product.model.js';

/**
 * Helper to compute discounted price
 */
export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  const numPrice = Number(originalPrice) || 0;
  const numDiscount = Number(discountPercentage) || 0;
  if (numPrice <= 0 || numDiscount <= 0) return numPrice;
  const discounted = numPrice * (1 - numDiscount / 100);
  return Math.round(discounted);
};

/**
 * GET /api/launch-sales
 * Protected admin route: retrieves all configured launch sales with populated products
 */
export const getAllLaunchSales = async (req, res) => {
  try {
    const sales = await LaunchSale.find()
      .populate('productId')
      .sort({ displayPriority: 1, createdAt: -1 })
      .lean();

    const now = new Date();

    // Map sales with calculated dynamic status and formatted prices
    const formatted = sales.map((sale) => {
      let currentStatus = sale.status;
      if (currentStatus !== 'paused') {
        const start = new Date(sale.startDateTime);
        const end = new Date(sale.endDateTime);
        if (now < start) {
          currentStatus = 'scheduled';
        } else if (now > end) {
          currentStatus = 'expired';
        } else {
          currentStatus = 'active';
        }
      }

      const product = sale.productId || null;
      const originalPrice = product ? Number(product.price) || 0 : 0;
      const discountedPrice = calculateDiscountedPrice(originalPrice, sale.discountPercentage);

      return {
        ...sale,
        status: currentStatus,
        product,
        originalPrice,
        discountedPrice,
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('[LaunchSale Controller] Error fetching launch sales:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve launch sales.',
      error: error.message,
    });
  }
};

/**
 * GET /api/launch-sales/active
 * Public route for storefront: retrieves only currently active and unpaused launch sales
 */
export const getActiveLaunchSales = async (req, res) => {
  try {
    await connectDB();
    const now = new Date();

    const sales = await LaunchSale.find({
      status: { $ne: 'paused' },
      startDateTime: { $lte: now },
      endDateTime: { $gte: now },
    })
      .populate('productId')
      .sort({ displayPriority: 1, createdAt: -1 })
      .lean();

    // Filter out items where the linked product was removed or is inactive
    const activeValid = sales
      .filter((sale) => sale.productId && Boolean(sale.productId._id))
      .map((sale) => {
        const product = sale.productId;
        const originalPrice = Number(product.price) || 0;
        const discountedPrice = calculateDiscountedPrice(originalPrice, sale.discountPercentage);

        return {
          _id: sale._id,
          saleId: sale._id,
          productId: product._id,
          title: product.title,
          handle: product.handle,
          category: product.category,
          subCategory: product.subCategory,
          fit: product.fit,
          badge: product.badge || 'LAUNCH SALE',
          images: product.images || [],
          thumbnail: product.thumbnail || product.images?.[0] || '',
          inStock: product.inStock !== false,
          stock: product.stock ?? 50,
          originalPrice,
          price: discountedPrice,
          salePrice: `Rs. ${discountedPrice.toLocaleString('en-IN')}.00`,
          regularPrice: `Rs. ${originalPrice.toLocaleString('en-IN')}.00`,
          discountPercentage: sale.discountPercentage,
          startDateTime: sale.startDateTime,
          endDateTime: sale.endDateTime,
          remainingMs: Math.max(0, new Date(sale.endDateTime).getTime() - now.getTime()),
          status: 'active',
          displayPriority: sale.displayPriority || 0,
        };
      });

    res.set('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=60');
    return res.status(200).json({
      success: true,
      count: activeValid.length,
      data: activeValid,
    });
  } catch (error) {
    console.error('[LaunchSale Controller] Error fetching active launch sales:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active launch sales.',
      error: error.message,
    });
  }
};

/**
 * GET /api/launch-sales/product/:productIdOrHandle
 * Public route: checks if a product has an active launch sale and returns discounted pricing
 */
export const getLaunchSaleByProductId = async (req, res) => {
  try {
    await connectDB();
    const { productIdOrHandle } = req.params;
    let product = null;
    const rawParam = String(productIdOrHandle).trim();
    let decodedParam = rawParam;
    try {
      decodedParam = decodeURIComponent(rawParam).trim();
    } catch (e) {}

    if (mongoose.Types.ObjectId.isValid(rawParam)) {
      product = await Product.findById(rawParam).lean();
    } else if (mongoose.Types.ObjectId.isValid(decodedParam)) {
      product = await Product.findById(decodedParam).lean();
    }

    if (!product) {
      product = await Product.findOne({
        $or: [
          { handle: rawParam.toLowerCase() },
          { handle: decodedParam.toLowerCase() },
          { handle: new RegExp(`^${String(rawParam).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
          { handle: new RegExp(`^${String(decodedParam).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        ],
      }).lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const now = new Date();
    const activeSale = await LaunchSale.findOne({
      productId: product._id,
      status: { $ne: 'paused' },
      startDateTime: { $lte: now },
      endDateTime: { $gte: now },
    }).lean();

    if (!activeSale) {
      res.set('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=60');
      return res.status(200).json({
        success: true,
        hasActiveSale: false,
        data: null,
      });
    }

    const originalPrice = Number(product.price) || 0;
    const discountedPrice = calculateDiscountedPrice(originalPrice, activeSale.discountPercentage);

    res.set('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=60');
    return res.status(200).json({
      success: true,
      hasActiveSale: true,
      data: {
        _id: activeSale._id,
        productId: product._id,
        discountPercentage: activeSale.discountPercentage,
        startDateTime: activeSale.startDateTime,
        endDateTime: activeSale.endDateTime,
        originalPrice,
        discountedPrice,
        remainingMs: Math.max(0, new Date(activeSale.endDateTime).getTime() - now.getTime()),
        status: 'active',
      },
    });
  } catch (error) {
    console.error('[LaunchSale Controller] Error checking product sale:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check product launch sale status.',
      error: error.message,
    });
  }
};

/**
 * POST /api/launch-sales
 * Protected admin route: creates a new launch sale entry
 */
export const createLaunchSale = async (req, res) => {
  try {
    const {
      productId,
      discountPercentage,
      startDateTime,
      endDateTime,
      status = 'scheduled',
      displayPriority = 0,
    } = req.body;

    // 1. Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product selection is required.',
      });
    }

    const discountNum = Number(discountPercentage);
    if (isNaN(discountNum) || discountNum < 1 || discountNum > 99) {
      return res.status(400).json({
        success: false,
        message: 'Discount percentage must be a number between 1% and 99%.',
      });
    }

    if (!startDateTime || !endDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Start date/time and End date/time are required.',
      });
    }

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start or end date format.',
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date and time must be later than Start date and time.',
      });
    }

    // 2. Verify product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Selected product does not exist in the catalog.',
      });
    }

    // 3. Prevent duplicate active/scheduled campaign for the same product
    const now = new Date();
    const existingConflict = await LaunchSale.findOne({
      productId,
      status: { $ne: 'expired' },
      endDateTime: { $gt: now },
    });

    if (existingConflict) {
      return res.status(400).json({
        success: false,
        message: `Product "${product.title}" is already assigned to an ongoing or scheduled Launch Sale campaign.`,
      });
    }

    // 4. Determine initial status
    let initialStatus = status === 'paused' ? 'paused' : 'scheduled';
    if (status !== 'paused') {
      if (now >= startDate && now <= endDate) {
        initialStatus = 'active';
      } else if (now > endDate) {
        initialStatus = 'expired';
      }
    }

    // 5. Create record
    const newSale = await LaunchSale.create({
      productId,
      discountPercentage: discountNum,
      startDateTime: startDate,
      endDateTime: endDate,
      status: initialStatus,
      displayPriority: Number(displayPriority) || 0,
    });

    const populated = await LaunchSale.findById(newSale._id).populate('productId');

    return res.status(201).json({
      success: true,
      message: 'Launch sale created successfully.',
      data: populated,
    });
  } catch (error) {
    console.error('[LaunchSale Controller] Create error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create launch sale.',
      error: error.message,
    });
  }
};

/**
 * PUT /api/launch-sales/:id
 * Protected admin route: updates an existing launch sale entry
 */
export const updateLaunchSale = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productId,
      discountPercentage,
      startDateTime,
      endDateTime,
      status,
      displayPriority,
    } = req.body;

    const sale = await LaunchSale.findById(id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Launch sale record not found.',
      });
    }

    // Check conflict if product changed
    if (productId && String(productId) !== String(sale.productId)) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Selected product does not exist.',
        });
      }

      const now = new Date();
      const existingConflict = await LaunchSale.findOne({
        _id: { $ne: id },
        productId,
        status: { $ne: 'expired' },
        endDateTime: { $gt: now },
      });

      if (existingConflict) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.title}" is already assigned to an ongoing or scheduled Launch Sale campaign.`,
        });
      }
      sale.productId = productId;
    }

    if (discountPercentage !== undefined) {
      const discountNum = Number(discountPercentage);
      if (isNaN(discountNum) || discountNum < 1 || discountNum > 99) {
        return res.status(400).json({
          success: false,
          message: 'Discount percentage must be between 1% and 99%.',
        });
      }
      sale.discountPercentage = discountNum;
    }

    const startDate = startDateTime ? new Date(startDateTime) : sale.startDateTime;
    const endDate = endDateTime ? new Date(endDateTime) : sale.endDateTime;

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date and time must be later than Start date and time.',
      });
    }

    sale.startDateTime = startDate;
    sale.endDateTime = endDate;

    if (displayPriority !== undefined) {
      sale.displayPriority = Number(displayPriority) || 0;
    }

    if (status !== undefined) {
      sale.status = status;
    } else if (sale.status !== 'paused') {
      const now = new Date();
      if (now < startDate) {
        sale.status = 'scheduled';
      } else if (now > endDate) {
        sale.status = 'expired';
      } else {
        sale.status = 'active';
      }
    }

    await sale.save();
    const updated = await LaunchSale.findById(id).populate('productId');

    return res.status(200).json({
      success: true,
      message: 'Launch sale updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('[LaunchSale Controller] Update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update launch sale.',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/launch-sales/:id/status
 * Protected admin route: toggle pause / activate for a launch sale
 */
export const toggleLaunchSaleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await LaunchSale.findById(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Launch sale record not found.',
      });
    }

    const now = new Date();

    if (sale.status === 'paused') {
      // Resume / Activate
      if (now < new Date(sale.startDateTime)) {
        sale.status = 'scheduled';
      } else if (now > new Date(sale.endDateTime)) {
        sale.status = 'expired';
      } else {
        sale.status = 'active';
      }
    } else {
      // Pause
      sale.status = 'paused';
    }

    await sale.save();
    const updated = await LaunchSale.findById(id).populate('productId');

    return res.status(200).json({
      success: true,
      message: `Launch sale status updated to ${sale.status}.`,
      data: updated,
    });
  } catch (error) {
    console.error('[LaunchSale Controller] Toggle status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle launch sale status.',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/launch-sales/:id
 * Protected admin route: deletes a launch sale entry.
 * STRICT SAFETY RULE: NEVER deletes the underlying product from Catalog.
 */
export const deleteLaunchSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await LaunchSale.findById(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Launch sale entry not found.',
      });
    }

    // Delete only the LaunchSale record, never touching the Product collection
    await LaunchSale.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Launch sale entry removed successfully. Product preserved in catalog.',
      deletedId: id,
    });
  } catch (error) {
    console.error('[LaunchSale Controller] Delete error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete launch sale entry.',
      error: error.message,
    });
  }
};
