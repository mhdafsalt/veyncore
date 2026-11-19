import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// CORS configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Standard body-parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads serving (placeholder for user-uploaded assets)
app.use('/uploads', express.static('uploads'));

// Mount API routes
app.use('/api', apiRoutes);

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
