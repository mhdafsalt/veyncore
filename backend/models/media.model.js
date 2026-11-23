import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    fullUrl: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      default: null,
      trim: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    mimetype: {
      type: String,
      default: '',
    },
    storage: {
      type: String,
      enum: ['cloudinary', 'local', 'tmp'],
      default: 'cloudinary',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookups and sorting
mediaSchema.index({ filename: 1 });
mediaSchema.index({ publicId: 1 });
mediaSchema.index({ createdAt: -1 });

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);
export default Media;
