import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    parentCategory: {
      type: String,
      trim: true,
    },
    mainCategory: {
      type: String,
      enum: ['VEYN-SELECTS', 'VEYN-OBJECTS'],
      default: 'VEYN-SELECTS',
      required: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    href: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    isGlow: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'subcategories',
  }
);

// Compound indexes for storefront subcategory navigation
subcategorySchema.index({ mainCategory: 1, active: 1, sortOrder: 1 });
subcategorySchema.index({ slug: 1 });

const Subcategory =
  mongoose.models.Subcategory || mongoose.model('Subcategory', subcategorySchema);

export default Subcategory;
