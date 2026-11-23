import dns from 'node:dns';
import dotenv from 'dotenv';
import path from 'node:path';
import mongoose from 'mongoose';

if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.AWS_EXECUTION_ENV) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {}
}

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

let cachedConnection = null;

/**
 * Connect to MongoDB Atlas using Mongoose
 */
export const connectDB = async () => {
  // Reuse existing connection if already established (serverless optimization)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;

  // Verify connection string presence and placeholder status
  if (!uri || uri === 'your_mongodb_atlas_connection_string') {
    console.warn(
      '[Database Warning] MONGODB_URI is not configured or is set to placeholder.\n' +
      'Please update your .env file with a valid MongoDB Atlas connection string.\n' +
      'Skipping database connection for now...'
    );
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    cachedConnection = conn;

    // Mask credentials when logging host info
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    // Allow the application to stay up for diagnostic/health check endpoints if desired,
    // or log error for debugging without exiting abruptly in development.
    return null;
  }
};

/**
 * Helper to get current database connection state
 * 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
 */
export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

export default connectDB;
