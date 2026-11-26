import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
import mongoose from 'mongoose';
import apiRoutes from './routes/index.js';
import connectDB from './config/db.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Dynamic CORS configuration supporting local development and deployed frontend
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://veyncorein.vercel.app',
  'https://veyncore.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app');

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Cache-Control',
    'Pragma',
    'Expires',
    'If-Modified-Since',
  ],
  exposedHeaders: ['Cache-Control', 'Pragma', 'Expires'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Standard body-parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection & route-gating middleware (optimized for Vercel Serverless)
app.use(async (req, res, next) => {
  const isNonDbRoute =
    req.method === 'OPTIONS' ||
    req.path === '/' ||
    req.path.startsWith('/api/health') ||
    req.path.startsWith('/health');

  // Allow non-database routes and preflight checks to proceed without blocking
  if (isNonDbRoute) {
    connectDB().catch(() => {});
    return next();
  }

  // Ensure database is connected before handling database-dependent routes
  try {
    const conn = await connectDB();
    if (conn && mongoose.connection.readyState === 1) {
      return next();
    }

    return res.status(503).json({
      success: false,
      message: 'Database connection is temporarily unavailable. Please verify MONGODB_URI in Vercel settings and ensure MongoDB Atlas Network Access allows 0.0.0.0/0.',
      error: 'DATABASE_UNAVAILABLE',
      database: 'disconnected',
    });
  } catch (err) {
    console.error('[Database Middleware Error]', err.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure MONGODB_URI is properly configured.',
      error: err.message,
      database: 'disconnected',
    });
  }
});

// Static uploads serving for uploaded media assets (safe on read-only serverless filesystems)
try {
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  if (fs.existsSync(uploadsPath)) {
    app.use('/uploads', express.static(uploadsPath));
  }
  const tmpUploadsPath = path.join(os.tmpdir(), 'uploads');
  if (fs.existsSync(tmpUploadsPath)) {
    app.use('/uploads', express.static(tmpUploadsPath));
  }
} catch (e) {
  // Gracefully ignored on read-only environments
}

// Mount API routes at both /api and root / for seamless flexibility
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Veyncore Backend API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
