import mongoose from 'mongoose';

export const DEFAULT_PRODUCT_DETAILS = [
  'Handpicked by VEYNCORE',
  'Not manufactured by VEYNCORE',
  'Carefully selected from trusted suppliers',
  'Premium quality standards',
  'Quality checked before dispatch',
  'Designed for everyday comfort and style',
  'Easy 7-day returns and exchanges on eligible products'
];

export const DEFAULT_PRODUCT_SHIPPING = [
  'Orders are carefully packed and dispatched within 24–48 business hours.',
  'Standard delivery takes approximately 3–5 working days.',
  'Real-time order tracking available after dispatch.',
  'Easy 7-day returns and exchanges on eligible products.'
];

export const DEFAULT_SELECT_STORY =
  'VEYN SELECTS is an exclusive collection of carefully curated fashion pieces, handpicked to match VEYNCORE’s distinctive style and vision. Each piece is thoughtfully sourced and quality-checked, bringing together unique designs, premium appeal, and everyday comfort. A collection made for those who value individuality, detail, and effortless style.';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    handle: {
      type: String,
      required: [true, 'Product handle is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ['VEYN-SELECTS', 'VEYN-OBJECTS'],
      default: 'VEYN-SELECTS',
      required: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: 'BAGGY',
    },
    fit: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    comparePrice: {
      type: Number,
      default: null,
    },
    salePrice: {
      type: String,
      default: '',
    },
    regularPrice: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      default: ['/images/products/artic-blue-wide.jpg'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    availableSizes: {
      type: [String],
      default: ['28', '30', '32', '34'],
    },
    description: {
      type: String,
      default: '',
    },
    details: {
      type: [String],
      default: () => [...DEFAULT_PRODUCT_DETAILS],
    },
    specs: [
      {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
    ],
    shipping: {
      type: [String],
      default: () => [...DEFAULT_PRODUCT_SHIPPING],
    },
    selectStory: {
      type: String,
      default: DEFAULT_SELECT_STORY,
    },
    isObject: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 50,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    measurements: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    sizeChartImage: {
      type: String,
      default: '',
    },
    swipeCategory: {
      type: String,
      default: '',
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Format helper before saving
productSchema.pre('save', function (next) {
  if (this.price && !this.salePrice) {
    this.salePrice = `Rs. ${this.price.toLocaleString('en-IN')}.00`;
  }
  if (this.comparePrice && !this.regularPrice) {
    this.regularPrice = `Rs. ${this.comparePrice.toLocaleString('en-IN')}.00`;
  }
  if (this.images && this.images.length > 0 && !this.thumbnail) {
    this.thumbnail = this.images[0];
  }
  if (this.category === 'VEYN-OBJECTS') {
    this.isObject = true;
  }
  if (this.stock !== undefined) {
    this.inStock = Number(this.stock) > 0;
  }
  if (!this.details || this.details.length === 0) {
    this.details = [...DEFAULT_PRODUCT_DETAILS];
  }
  if (!this.shipping || this.shipping.length === 0) {
    this.shipping = [...DEFAULT_PRODUCT_SHIPPING];
  }
  if (!this.selectStory) {
    this.selectStory = DEFAULT_SELECT_STORY;
  }
  next();
});

// Compound indexes for collection drop listings and multi-attribute filters
productSchema.index({ category: 1, sortOrder: 1, createdAt: -1 });
productSchema.index({ category: 1, subCategory: 1, createdAt: -1 });
productSchema.index({ category: 1, fit: 1, createdAt: -1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, price: -1 });
productSchema.index({ category: 1, isObject: 1 });

// Storefront highlight filters
productSchema.index({ featured: 1, createdAt: -1 });
productSchema.index({ newArrival: 1, createdAt: -1 });
productSchema.index({ isObject: 1, createdAt: -1 });
productSchema.index({ inStock: 1 });
productSchema.index({ swipeCategory: 1 });

// Standalone price and timestamp sorting
productSchema.index({ price: 1 });
productSchema.index({ price: -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
