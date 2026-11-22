import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main_site_content',
    },
    announcements: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        active: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    subcategories: [
      {
        id: { type: String, required: true },
        mainCategory: {
          type: String,
          enum: ['VEYN-SELECTS', 'VEYN-OBJECTS'],
          default: 'VEYN-SELECTS',
        },
        label: { type: String, required: true },
        href: { type: String, required: true },
        image: { type: String, default: '' },
        isGlow: { type: Boolean, default: false },
        sortOrder: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
      },
    ],
    heroSlides: [
      {
        id: { type: String, required: true },
        targetSection: {
          type: String,
          enum: ['VEYN-SELECTS', 'VEYN-OBJECTS'],
          default: 'VEYN-SELECTS',
        },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        tag: { type: String, default: '' },
        image: { type: String, required: true },
        href: { type: String, default: '/collections/all-drops' },
        description: { type: String, default: '' },
        sortOrder: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
      },
    ],
    swipeCategories: [
      {
        id: { type: String, required: true },
        targetSection: {
          type: String,
          enum: ['VEYN-SELECTS', 'VEYN-OBJECTS'],
          default: 'VEYN-SELECTS',
        },
        key: { type: String, required: true }, // e.g. 'baggy', 'bootcut', 'wide', 'straight', 'bags', 'chains'
        label: { type: String, required: true },
        image: { type: String, default: '' },
        collectionPath: { type: String, default: '/collections/all-drops' },
        sortOrder: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
      },
    ],
    bottomBanner: {
      imageDesktop: { type: String, default: '/images/ImageBanner.png' },
      imageMobile: { type: String, default: '/images/ImageBanner-Mob.png' },
      altText: { type: String, default: 'VEYNCORE Campaign Banner' },
      buttonLink: { type: String, default: '/collections/all-drops' },
      active: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

const SiteContent =
  mongoose.models.SiteContent || mongoose.model('SiteContent', contentSchema);

export default SiteContent;
