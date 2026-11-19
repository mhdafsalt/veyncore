import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize MongoDB connection
connectDB();

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`[Server] Backend server running on port ${PORT}`);
  console.log(`[Server] Health check available at: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Process] Unhandled Rejection: ${err.message}`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('[Server] Gracefully shutting down...');
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
