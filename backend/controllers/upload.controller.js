import fs from 'fs';
import path from 'path';
import os from 'os';
import Media from '../models/media.model.js';
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from '../config/cloudinary.js';

/**
 * POST /api/upload
 * Handles single image file upload:
 * - Persistent Cloudinary cloud upload if configured (Production Vercel)
 * - Safe /tmp fallback on serverless or uploads folder in local dev if Cloudinary is not yet set
 * - Stores file record in MongoDB Media collection
 */
export const handleSingleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file was uploaded. Please attach an image file.',
      });
    }

    const originalName = req.file.originalname || 'image.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const cleanBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 32);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    const filename = `${cleanBase}-${uniqueSuffix}${ext}`;

    let savedUrl = '';
    let savedFullUrl = '';
    let publicId = null;
    let storageType = 'cloudinary';

    if (isCloudinaryConfigured()) {
      // 1. Production Persistent Storage: Cloudinary
      try {
        const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer, {
          folder: 'veyncore_uploads',
          publicId: `${cleanBase}-${uniqueSuffix}`,
        });

        savedUrl = cloudinaryResult.secure_url;
        savedFullUrl = cloudinaryResult.secure_url;
        publicId = cloudinaryResult.public_id;
        storageType = 'cloudinary';
      } catch (cloudErr) {
        console.error('[Upload Controller] Cloudinary upload failed:', cloudErr.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image to cloud storage.',
          error: cloudErr.message,
        });
      }
    } else {
      // 2. Cloudinary is not configured: safe fallback (/tmp in serverless, uploads in local dev)
      const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
      const targetDir = isServerless
        ? path.join(os.tmpdir(), 'uploads')
        : path.resolve(process.cwd(), 'uploads');

      try {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.writeFileSync(path.join(targetDir, filename), req.file.buffer);
      } catch (writeErr) {
        console.warn('[Upload Controller] Local fallback write warning:', writeErr.message);
      }

      const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
      savedUrl = `/uploads/${filename}`;
      savedFullUrl = `${baseUrl}/uploads/${filename}`;
      storageType = isServerless ? 'tmp' : 'local';

      // Mirror to frontend/public/uploads if accessible in local dev (non-fatal)
      if (!isServerless) {
        try {
          const frontendPublicUploads = path.resolve(process.cwd(), '../frontend/public/uploads');
          const frontendPublic = path.resolve(process.cwd(), '../frontend/public');
          if (fs.existsSync(frontendPublic)) {
            if (!fs.existsSync(frontendPublicUploads)) {
              fs.mkdirSync(frontendPublicUploads, { recursive: true });
            }
            fs.writeFileSync(path.join(frontendPublicUploads, filename), req.file.buffer);
          }
        } catch (copyErr) {
          // Non-fatal
        }
      }
    }

    // 3. Persist media record in MongoDB
    let mediaRecord = null;
    try {
      mediaRecord = await Media.create({
        filename,
        url: savedUrl,
        fullUrl: savedFullUrl,
        publicId,
        size: req.file.size,
        mimetype: req.file.mimetype,
        storage: storageType,
      });
    } catch (dbErr) {
      console.warn('[Upload Controller] MongoDB Media recording warning:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      message: isCloudinaryConfigured()
        ? 'Image uploaded successfully to Cloudinary.'
        : 'Image uploaded successfully.',
      data: {
        id: mediaRecord?._id || null,
        filename,
        url: savedUrl,
        fullUrl: savedFullUrl,
        publicId,
        size: req.file.size,
        mimetype: req.file.mimetype,
        storage: storageType,
      },
    });
  } catch (error) {
    console.error('[Upload Controller] Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process file upload.',
      error: error.message,
    });
  }
};

/**
 * GET /api/upload
 * List all uploaded media files in media library
 * Prioritizes MongoDB Media collection, with safe fallback to local files
 */
export const getUploadedFiles = async (req, res) => {
  try {
    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;

    // 1. Fetch from MongoDB Media collection
    try {
      const mediaDocs = await Media.find().sort({ createdAt: -1 }).lean();
      if (mediaDocs && mediaDocs.length > 0) {
        const data = mediaDocs.map((item) => ({
          id: item._id,
          filename: item.filename,
          url: item.url,
          fullUrl: item.fullUrl.startsWith('http') ? item.fullUrl : `${baseUrl}${item.url}`,
          publicId: item.publicId,
          size: item.size,
          createdAt: item.createdAt,
        }));

        return res.status(200).json({
          success: true,
          count: data.length,
          data,
        });
      }
    } catch (dbErr) {
      console.warn('[Upload Controller] DB fetch failed, falling back to disk:', dbErr.message);
    }

    // 2. Fallback: local uploads folder if available
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const files = fs.readdirSync(uploadDir);
    const fileList = files
      .filter((file) => !file.startsWith('.') && /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(file))
      .map((file) => {
        try {
          const filePath = path.join(uploadDir, file);
          const stats = fs.statSync(filePath);
          return {
            filename: file,
            url: `/uploads/${file}`,
            fullUrl: `${baseUrl}/uploads/${file}`,
            size: stats.size,
            createdAt: stats.birthtime || stats.mtime,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: fileList.length,
      data: fileList,
    });
  } catch (error) {
    console.error('[Upload Controller] List error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve media library.',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/upload/:filename
 * Remove uploaded file by filename, publicId, or MongoDB ID
 */
export const deleteUploadedFile = async (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) {
      return res.status(400).json({ success: false, message: 'Filename is required.' });
    }

    // 1. Look up in MongoDB
    let media = null;
    try {
      media = await Media.findOne({
        $or: [
          { filename },
          { publicId: filename },
          ...(filename.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: filename }] : []),
        ],
      });
    } catch (findErr) {
      // Continue to local cleanup
    }

    // 2. If it has a Cloudinary publicId, delete from Cloudinary
    if (media?.publicId) {
      try {
        await deleteFromCloudinary(media.publicId);
      } catch (cloudDelErr) {
        console.warn('[Upload Controller] Cloudinary delete warning:', cloudDelErr.message);
      }
    }

    // 3. Delete from MongoDB
    if (media) {
      try {
        await Media.deleteOne({ _id: media._id });
      } catch (dbDelErr) {
        console.warn('[Upload Controller] MongoDB delete warning:', dbDelErr.message);
      }
    }

    // 4. Safely clean up local files if present
    try {
      const safeName = path.basename(filename);
      const uploadDir = path.resolve(process.cwd(), 'uploads');
      const targetPath = path.join(uploadDir, safeName);
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
      const tmpPath = path.join(os.tmpdir(), 'uploads', safeName);
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
      const frontendFile = path.resolve(process.cwd(), '../frontend/public/uploads', safeName);
      if (fs.existsSync(frontendFile)) {
        fs.unlinkSync(frontendFile);
      }
    } catch (e) {
      // Non-fatal
    }

    return res.status(200).json({
      success: true,
      message: 'File removed from media storage.',
    });
  } catch (error) {
    console.error('[Upload Controller] Delete error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete file.',
      error: error.message,
    });
  }
};
