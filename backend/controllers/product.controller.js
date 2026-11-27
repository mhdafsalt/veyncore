import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product, {
  DEFAULT_PRODUCT_DETAILS,
  DEFAULT_PRODUCT_SHIPPING,
  DEFAULT_SELECT_STORY,
} from '../models/product.model.js';

/**
 * Helper to escape special regex characters for safe MongoDB queries
 * Prevents ReDoS attacks and regex syntax errors from special user inputs
 */
const escapeRegex = (str = '') =>
  String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * GET /api/products
 * Query products with optional filters, safe regex matching, pagination, and caching
 */
export const getProducts = async (req, res) => {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is not ready. Please try again shortly.',
        error: 'DATABASE_DISCONNECTED',
      });
    }
    const {
      category,
      subCategory,
      fit,
      swipeCategory,
      search,
      featured,
      newArrival,
      sort,
      page = 1,
      limit = 100,
    } = req.query;

    const filter = {};

    // 1. Category filter with strict independence between VEYN-SELECTS and VEYN-OBJECTS
    if (category) {
      if (category === 'VEYN-OBJECTS') {
        filter.$or = [{ category: 'VEYN-OBJECTS' }, { isObject: true }];
      } else if (category === 'VEYN-SELECTS') {
        filter.category = 'VEYN-SELECTS';
        filter.isObject = { $ne: true };
      } else {
        filter.category = category;
      }
    }

    // 2. Subcategory filter with safe regex
    if (subCategory) {
      const cleanSub = escapeRegex(String(subCategory).trim().replace(/[-_]/g, ' '));
      filter.$or = [
        { subCategory: new RegExp(cleanSub, 'i') },
        { fit: new RegExp(cleanSub, 'i') },
        { swipeCategory: new RegExp(cleanSub, 'i') },
      ];
    }

    // 3. Fit filter with safe regex
    if (fit) {
      const cleanFit = escapeRegex(String(fit).trim().replace(/[-_]/g, ' '));
      if (filter.$or) {
        filter.$and = [
          { $or: filter.$or },
          {
            $or: [
              { fit: new RegExp(cleanFit, 'i') },
              { subCategory: new RegExp(cleanFit, 'i') },
            ],
          },
        ];
        delete filter.$or;
      } else {
        filter.$or = [
          { fit: new RegExp(cleanFit, 'i') },
          { subCategory: new RegExp(cleanFit, 'i') },
        ];
      }
    }

    if (swipeCategory) {
      const cleanSwipe = escapeRegex(String(swipeCategory).trim());
      filter.swipeCategory = new RegExp(`^${cleanSwipe}$`, 'i');
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (newArrival === 'true') {
      filter.newArrival = true;
    }

    // 4. Safe Search across title, handle, subCategory, fit, and swipeCategory
    if (search && String(search).trim()) {
      const safeSearch = escapeRegex(String(search).trim());
      const searchConditions = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { handle: { $regex: safeSearch, $options: 'i' } },
        { subCategory: { $regex: safeSearch, $options: 'i' } },
        { fit: { $regex: safeSearch, $options: 'i' } },
        { swipeCategory: { $regex: safeSearch, $options: 'i' } },
      ];

      if (filter.$or) {
        filter.$and = (filter.$and || []).concat([
          { $or: filter.$or },
          { $or: searchConditions },
        ]);
        delete filter.$or;
      } else if (filter.$and) {
        filter.$and.push({ $or: searchConditions });
      } else {
        filter.$or = searchConditions;
      }
    }

    let query = Product.find(filter);

    // 5. Indexed Sorting
    if (sort === 'price-low') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-high') {
      query = query.sort({ price: -1 });
    } else if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    } else {
      query = query.sort({ sortOrder: 1, createdAt: -1 });
    }

    // 6. Pagination & High-performance Lean Query Execution
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 100));
    const skip = (pageNum - 1) * limitNum;

    const products = await query.skip(skip).limit(limitNum).lean();

    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('[Product Controller] Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products.',
      error: error.message,
    });
  }
};

/**
 * GET /api/products/:handleOrId
 * Retrieve single product by handle or MongoDB _id
 */
export const getProductByHandleOrId = async (req, res) => {
  try {
    await connectDB();
    const { handleOrId } = req.params;

    if (!handleOrId) {
      return res.status(400).json({
        success: false,
        message: 'Product handle or ID is required.',
      });
    }

    let product = null;
    const cleanHandle = String(handleOrId).trim();

    if (mongoose.Types.ObjectId.isValid(cleanHandle)) {
      product = await Product.findById(cleanHandle).lean();
    }

    if (!product) {
      product = await Product.findOne({ handle: cleanHandle.toLowerCase() }).lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const prodObj = { ...product };
    if (!prodObj.details || !Array.isArray(prodObj.details) || prodObj.details.length === 0) {
      prodObj.details = [...DEFAULT_PRODUCT_DETAILS];
    }
    if (!prodObj.shipping || !Array.isArray(prodObj.shipping) || prodObj.shipping.length === 0) {
      prodObj.shipping = [...DEFAULT_PRODUCT_SHIPPING];
    }
    if (!prodObj.selectStory) {
      prodObj.selectStory = DEFAULT_SELECT_STORY;
    }

    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({
      success: true,
      data: prodObj,
    });
  } catch (error) {
    console.error('[Product Controller] Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product details.',
      error: error.message,
    });
  }
};

/**
 * POST /api/products
 * Admin only: Create a new product
 */
export const createProduct = async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.price) {
      return res.status(400).json({
        success: false,
        message: 'Product title and price are required.',
      });
    }

    data.title = String(data.title).toUpperCase().trim();

    // Auto-generate handle if missing
    if (!data.handle) {
      data.handle = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Ensure handle uniqueness
    let existing = await Product.findOne({ handle: data.handle });
    if (existing) {
      data.handle = `${data.handle}-${Date.now().toString().slice(-4)}`;
    }

    // Formatting prices
    const numPrice = Number(data.price);
    const numCompare = data.comparePrice ? Number(data.comparePrice) : null;
    data.price = numPrice;
    data.comparePrice = numCompare;
    data.salePrice = `Rs. ${numPrice.toLocaleString('en-IN')}.00`;
    if (numCompare) {
      data.regularPrice = `Rs. ${numCompare.toLocaleString('en-IN')}.00`;
    }

    if (data.images && data.images.length > 0 && !data.thumbnail) {
      data.thumbnail = data.images[0];
    }

    if (data.category === 'VEYN-OBJECTS') {
      data.isObject = true;
    }

    if (data.stock !== undefined) {
      data.stock = Math.max(0, Number(data.stock) || 0);
      data.inStock = data.stock > 0;
    } else if (data.inStock !== undefined) {
      data.stock = data.inStock ? 50 : 0;
    }

    if (data.sizeChartImage) {
      data.sizeChartImage = String(data.sizeChartImage).trim();
    }

    if (!data.details || !Array.isArray(data.details) || data.details.length === 0) {
      data.details = [...DEFAULT_PRODUCT_DETAILS];
    }
    if (!data.shipping || !Array.isArray(data.shipping) || data.shipping.length === 0) {
      data.shipping = [...DEFAULT_PRODUCT_SHIPPING];
    }
    if (!data.selectStory) {
      data.selectStory = DEFAULT_SELECT_STORY;
    }

    const product = await Product.create(data);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    console.error('[Product Controller] Error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product.',
      error: error.message,
    });
  }
};

/**
 * PUT /api/products/:id
 * Admin only: Update an existing product
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.title) {
      updates.title = String(updates.title).toUpperCase().trim();
    }

    if (updates.price) {
      updates.price = Number(updates.price);
      updates.salePrice = `Rs. ${updates.price.toLocaleString('en-IN')}.00`;
    }

    if (updates.comparePrice) {
      updates.comparePrice = Number(updates.comparePrice);
      updates.regularPrice = `Rs. ${updates.comparePrice.toLocaleString('en-IN')}.00`;
    } else if (updates.comparePrice === '' || updates.comparePrice === null) {
      updates.comparePrice = null;
      updates.regularPrice = '';
    }

    if (updates.images && updates.images.length > 0) {
      updates.thumbnail = updates.images[0];
    }

    if (updates.category === 'VEYN-OBJECTS') {
      updates.isObject = true;
    } else if (updates.category === 'VEYN-SELECTS') {
      updates.isObject = false;
    }

    if (updates.stock !== undefined) {
      updates.stock = Math.max(0, Number(updates.stock) || 0);
      updates.inStock = updates.stock > 0;
    } else if (updates.inStock !== undefined && updates.stock === undefined) {
      updates.stock = updates.inStock ? 50 : 0;
    }

    if (updates.sizeChartImage !== undefined) {
      updates.sizeChartImage = String(updates.sizeChartImage).trim();
    }

    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
    }
    if (!product) {
      product = await Product.findOneAndUpdate(
        {
          $or: [
            { handle: String(id).toLowerCase().trim() },
            { id: String(id).trim() },
          ],
        },
        updates,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    console.error('[Product Controller] Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product.',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/products/:id
 * Admin only: Delete product by ID
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndDelete(id);
    }

    if (!product) {
      product = await Product.findOneAndDelete({
        $or: [
          { handle: String(id).toLowerCase().trim() },
          { id: String(id).trim() },
          { slug: String(id).toLowerCase().trim() },
        ],
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product "${product.title}" deleted successfully.`,
      deletedId: product._id || id,
    });
  } catch (error) {
    console.error('[Product Controller] Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
      error: error.message,
    });
  }
};

/**
 * POST /api/products/seed
 * Seed initial catalog data into MongoDB if collection is empty
 */
export const seedProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0 && req.query.force !== 'true') {
      return res.status(200).json({
        success: true,
        message: `Database already has ${count} products. Pass ?force=true to overwrite.`,
        count,
      });
    }

    if (req.query.force === 'true') {
      await Product.deleteMany({});
    }

    // Default Seed Products
    const DEFAULT_PRODUCTS = [
      // Denim Fits (VEYN-SELECTS)
      {
        title: 'VEXO BLUE BAGGY',
        handle: 'vexo-blue-baggy',
        category: 'VEYN-SELECTS',
        subCategory: 'BAGGY',
        fit: 'baggy',
        swipeCategory: 'baggy',
        price: 1499,
        comparePrice: 1700,
        badge: 'NEW',
        images: [
          'https://blurgvillage.com/cdn/shop/files/WEBP_File_6930.webp?v=1795179025&width=800',
          'https://blurgvillage.com/cdn/shop/files/WEBP_File_6933.webp?v=1795179029&width=800',
          'https://blurgvillage.com/cdn/shop/files/WEBP_File_6931.webp?v=1795179025&width=800',
        ],
        availableSizes: ['28', '30', '32', '34', '36'],
        description: 'Heavyweight rigid denim with relaxed stacking and authentic wash.',
        featured: true,
        newArrival: true,
        sortOrder: 1,
      },
      {
        title: 'TINTED BLUE WIDE',
        handle: 'tinted-blue-wide',
        category: 'VEYN-SELECTS',
        subCategory: 'WIDE',
        fit: 'wide',
        swipeCategory: 'wide',
        price: 1499,
        comparePrice: 1700,
        badge: 'SALE',
        images: [
          'https://blurgvillage.com/cdn/shop/files/WEBP_File_6875.webp?v=1795178652&width=800',
          'https://blurgvillage.com/cdn/shop/files/WEBP_File_6877.webp?v=1795178657&width=800',
        ],
        availableSizes: ['28', '30', '32', '34'],
        description: 'Vintage tinted wash with ultra-wide leg silhouette.',
        featured: true,
        sortOrder: 2,
      },
      {
        title: 'NID BLUE WIDE',
        handle: 'nid-blue-wide',
        category: 'VEYN-SELECTS',
        subCategory: 'WIDE',
        fit: 'wide',
        swipeCategory: 'wide',
        price: 1499,
        comparePrice: 1700,
        badge: 'MUST HAVE',
        images: [
          'https://blurgvillage.com/cdn/shop/files/WEBP_File_6820.webp?v=1795178401&width=800',
          'https://blurgvillage.com/cdn/shop/files/WEBP_File_6822.webp?v=1795178408&width=800',
        ],
        availableSizes: ['28', '30', '32', '34'],
        description: 'Light wash relaxed wide leg cut tailored for effortless drape.',
        featured: true,
        sortOrder: 3,
      },
      {
        title: 'COAL BLUE BAGGY',
        handle: 'coal-blue-baggy',
        category: 'VEYN-SELECTS',
        subCategory: 'BAGGY',
        fit: 'baggy',
        swipeCategory: 'baggy',
        price: 1499,
        comparePrice: 1700,
        badge: 'SALE',
        images: [
          'https://blurgvillage.com/cdn/shop/files/WEBP_File_6900.webp?v=1795178822&width=800',
          'https://blurgvillage.com/cdn/shop/files/WEBP_File_6902.webp?v=1795178828&width=800',
        ],
        availableSizes: ['28', '30', '32', '34', '36'],
        description: 'Deep indigo coal wash denim with rugged pocket finishing.',
        featured: true,
        sortOrder: 4,
      },
      {
        title: 'ARTIC BLUE WIDE',
        handle: 'artic-blue-wide',
        category: 'VEYN-SELECTS',
        subCategory: 'WIDE',
        fit: 'wide',
        swipeCategory: 'wide',
        price: 1199,
        comparePrice: 1599,
        badge: 'SALE',
        images: [
          'https://veyncult.com/cdn/shop/files/Photoroom_20261114_161026_7cdcaaa2-a323-4305-befb-1dfb2be657aa.jpg?v=1794653177&width=832',
          'https://veyncult.com/cdn/shop/files/Photoroom_20261114_161205.jpg?v=1794652964&width=832',
        ],
        availableSizes: ['28', '30', '32', '34', '36'],
        description: 'Frosty arctic wash wide denim engineered for daily wear.',
        newArrival: true,
        sortOrder: 5,
      },
      {
        title: 'SMOKE ASH SEMI BOOTCUT',
        handle: 'smoke-ash-semi-bootcut',
        category: 'VEYN-SELECTS',
        subCategory: 'BOOTCUT',
        fit: 'bootcut',
        swipeCategory: 'bootcut',
        price: 1299,
        comparePrice: 1799,
        badge: 'SALE',
        images: [
          'https://veyncult.com/cdn/shop/files/Photoroom_20261120_185006.jpg?v=1795182656&width=1000',
          'https://veyncult.com/cdn/shop/files/Photoroom_20261120_185049.jpg?v=1795182684&width=1000',
        ],
        availableSizes: ['28', '30', '32', '34'],
        description: 'Smoke ash subtle flare silhouette.',
        sortOrder: 6,
      },
      // Objects (VEYN-OBJECTS)
      {
        title: 'TACTICAL CROSSBODY CARGO BAG',
        handle: 'tactical-crossbody-cargo-bag',
        category: 'VEYN-OBJECTS',
        subCategory: 'BAGS',
        swipeCategory: 'bags',
        isObject: true,
        price: 1499,
        comparePrice: 2199,
        badge: 'NEW',
        images: [
          '/images/hero/ObjectHero01.png',
          '/images/hero/hero-card-3.jpg',
        ],
        availableSizes: ['ONE SIZE'],
        description: '1000D Ballistic tactical canvas with quick-release metal cobra buckle.',
        featured: true,
        sortOrder: 10,
      },
      {
        title: 'HEAVY LINK INDUSTRIAL CHAIN',
        handle: 'heavy-link-industrial-chain',
        category: 'VEYN-OBJECTS',
        subCategory: 'CHAINS',
        swipeCategory: 'chains',
        isObject: true,
        price: 1199,
        comparePrice: 1799,
        badge: 'BESTSELLER',
        images: [
          '/images/hero/ObjectHero02.png',
          '/images/hero/hero-card-3.jpg',
        ],
        availableSizes: ['55 CM', '65 CM'],
        description: '316L Surgical stainless steel curb link chain with custom laser engraving.',
        featured: true,
        sortOrder: 11,
      },
      {
        title: 'DISTRESSED BRUTALIST METAL CAP',
        handle: 'distressed-brutalist-metal-cap',
        category: 'VEYN-OBJECTS',
        subCategory: 'CAPS',
        swipeCategory: 'headwear',
        isObject: true,
        price: 999,
        comparePrice: 1499,
        badge: 'HOT',
        images: [
          '/images/hero/hero-card-3.jpg',
        ],
        availableSizes: ['ADJUSTABLE'],
        description: 'Heavyweight vintage washed cotton twill with distressed brass hardware.',
        featured: true,
        sortOrder: 12,
      },
    ];

    const inserted = await Product.insertMany(DEFAULT_PRODUCTS);

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} initial products.`,
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    console.error('[Product Controller] Error seeding products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed products.',
      error: error.message,
    });
  }
};

export default {
  getProducts,
  getProductByHandleOrId,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
};
