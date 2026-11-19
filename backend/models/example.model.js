import mongoose from 'mongoose';

/**
 * Example Mongoose Model Schema
 * Demonstrates clean Mongoose schema definition following MVC architecture
 */
const exampleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'archived'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Example = mongoose.model('Example', exampleSchema);

export default Example;
