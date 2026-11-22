import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      required: [true, 'Product handle is required.'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required.'],
      trim: true,
    },
    fit: {
      type: String,
      default: 'Baggy Fit',
      trim: true,
    },
    category: {
      type: String,
      default: 'VEYN-SELECTS',
      enum: ['VEYN-SELECTS', 'VEYN-OBJECTS'],
      trim: true,
    },
    subCategory: {
      type: String,
      default: 'BAGGY',
      trim: true,
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative.'],
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
    discount: {
      type: String,
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
      default: ['28', '30', '32', '34', '36'],
    },
    description: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isObject: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to format salePrice and regularPrice if not provided
productSchema.pre('save', function (next) {
  if (this.price) {
    this.salePrice = `Rs. ${this.price.toLocaleString('en-IN')}.00`;
  }
  if (this.comparePrice) {
    this.regularPrice = `Rs. ${this.comparePrice.toLocaleString('en-IN')}.00`;
    if (this.comparePrice > this.price) {
      const pct = Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
      this.discount = `Save ${pct}%`;
    }
  }
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
