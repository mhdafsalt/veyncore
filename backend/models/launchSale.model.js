import mongoose from 'mongoose';

const launchSaleSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required for Launch Sale'],
      index: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [1, 'Discount percentage must be at least 1%'],
      max: [99, 'Discount percentage cannot exceed 99%'],
    },
    startDateTime: {
      type: Date,
      required: [true, 'Start date and time is required'],
    },
    endDateTime: {
      type: Date,
      required: [true, 'End date and time is required'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'active', 'paused', 'expired'],
      default: 'scheduled',
    },
    displayPriority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Calculates current status dynamically against the server wall-clock time
 */
launchSaleSchema.methods.calculateCurrentStatus = function () {
  if (this.status === 'paused') {
    return 'paused';
  }
  const now = new Date();
  const start = new Date(this.startDateTime);
  const end = new Date(this.endDateTime);

  if (now < start) {
    return 'scheduled';
  }
  if (now > end) {
    return 'expired';
  }
  return 'active';
};

const LaunchSale = mongoose.models.LaunchSale || mongoose.model('LaunchSale', launchSaleSchema);

export default LaunchSale;
