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

const Subcategory =
  mongoose.models.Subcategory || mongoose.model('Subcategory', subcategorySchema);

export default Subcategory;
