import dns from 'node:dns';
import dotenv from 'dotenv';
import path from 'node:path';
import mongoose from 'mongoose';

// Fallback public DNS helper for environments with local/ISP SRV resolution blocks
const applyFallbackDNS = () => {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // Ignored if not permitted by environment
  }
};

// Pre-apply fallback DNS in non-serverless environments (e.g. Windows local development)
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.AWS_EXECUTION_ENV) {
  applyFallbackDNS();
}

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

// Global connection and in-flight promise cache for Serverless runtimes (AWS Lambda / Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Atlas using Mongoose with Serverless Optimization
 */
export const connectDB = async () => {
  // 1. Return existing connection if readyState is 1 (connected)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If connection is already in progress, await the existing promise
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (err) {
      cached.promise = null;
      throw err;
    }
  }

  const uri = process.env.MONGODB_URI;

  // 3. Verify connection string presence and placeholder status
  if (!uri || uri === 'your_mongodb_atlas_connection_string') {
    console.warn(
      '[Database Warning] MONGODB_URI is not configured or is set to placeholder in environment variables.\n' +
      'Please configure MONGODB_URI in your Vercel Project Settings (Settings -> Environment Variables).'
    );
    return null;
  }

  // 4. Connection options optimized for serverless environments
  const opts = {
    dbName: 'veyncore', // Guarantee target database name even if omitted from connection string
    bufferCommands: false, // Do NOT buffer queries for 10s when disconnected; fail fast instead
    serverSelectionTimeoutMS: 5000, // 5 seconds max to find a server
    socketTimeoutMS: 45000,
    family: 4, // Force IPv4 to prevent IPv6 routing delays
  };

  const executeConnect = async () => {
    try {
      return await mongoose.connect(uri, opts);
    } catch (error) {
      // If querySrv fails due to environment DNS (ECONNREFUSED / ENOTFOUND), retry once with fallback DNS
      if (
        error.message &&
        (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) &&
        uri.startsWith('mongodb+srv://')
      ) {
        console.warn('[Database] SRV DNS resolution failed. Retrying with fallback DNS...');
        applyFallbackDNS();
        return await mongoose.connect(uri, opts);
      }
      throw error;
    }
  };

  // 5. Create connection promise and cache it globally
  cached.promise = executeConnect()
    .then((mongooseInstance) => {
      cached.conn = mongooseInstance;
      console.log(
        `[Database] MongoDB Connected successfully: ${mongooseInstance.connection.host}/${mongooseInstance.connection.name}`
      );
      return mongooseInstance;
    })
    .catch((err) => {
      cached.promise = null; // Reset promise so subsequent requests can retry
      cached.conn = null;
      console.error(`[Database Error] Failed to connect to MongoDB: ${err.message}`);
      throw err;
    });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
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
