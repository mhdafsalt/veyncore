import app from '../app.js';
import connectDB from '../config/db.js';

/**
 * Vercel Serverless Function entry point
 * Pre-connects to MongoDB before dispatching to Express app
 */
export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    // Connection errors are caught and surfaced clearly by app's DB gating middleware
  }
  return app(req, res);
}
