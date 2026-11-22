import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import {
  handleSingleUpload,
  getUploadedFiles,
  deleteUploadedFile,
} from '../controllers/upload.controller.js';

const router = Router();

// Ensure local uploads directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 32);
    cb(null, `${cleanBase}-${Date.now()}${ext}`);
  },
});

// File filter restricting uploads to valid image formats
const fileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|webp|gif|svg|avif/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = (file.mimetype || '').toLowerCase();

  if (allowedExts.test(ext) && (mime.startsWith('image/') || mime === 'image/svg+xml')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP, GIF, SVG, and AVIF images are permitted.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

/**
 * GET /api/upload
 * List all uploaded files in media library (Admin only)
 */
router.get('/', authenticate, requireAdmin, getUploadedFiles);

/**
 * POST /api/upload
 * Multipart single image upload (Admin only)
 */
router.post('/', authenticate, requireAdmin, upload.single('image'), handleSingleUpload);

/**
 * DELETE /api/upload/:filename
 * Delete single file from media library (Admin only)
 */
router.delete('/:filename', authenticate, requireAdmin, deleteUploadedFile);

export default router;
