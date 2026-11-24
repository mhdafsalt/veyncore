import mongoose from 'mongoose';

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
      default: [],
    },
    specs: [
      {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
    ],
    shipping: {
      type: [String],
      default: [],
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
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
