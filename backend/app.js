import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import connectDB from './config/db.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Dynamic CORS configuration supporting local development and deployed frontend
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://veyncore.vercel.app',
].filter(Boolean);

app.use(
  cors({
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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Standard body-parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure MongoDB is connected (cached across serverless invocations on Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // Continue even if DB is still connecting to allow health endpoints to report status
  }
  next();
});

// Static uploads serving (placeholder for user-uploaded assets)
app.use('/uploads', express.static('uploads'));

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
