
import dns from 'node:dns';
import dotenv from 'dotenv';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const { default: app } = await import('./app.js');
const { default: connectDB } = await import('./config/db.js');

const PORT = process.env.PORT || 5000;

await connectDB();

const server = app.listen(PORT, () => {
  console.log(`[Server] Backend server running on port ${PORT}`);
  console.log(`[Server] Health check available at: http://localhost:${PORT}/api/health`);
});

process.on('unhandledRejection', (err) => {
  console.error(`[Process] Unhandled Rejection: ${err.message}`);
});

const gracefulShutdown = () => {
  console.log('[Server] Gracefully shutting down...');
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
