import fs from 'fs';
import path from 'path';

/**
 * POST /api/upload
 * Handles single image file upload and returns relative and full URLs
 */
export const handleSingleUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file was uploaded. Please attach an image file.',
      });
    }

    const filename = req.file.filename;
    const relativeUrl = `/uploads/${filename}`;
    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
    const fullUrl = `${baseUrl}/uploads/${filename}`;

    // Mirror to frontend/public/uploads if accessible so Next.js static server can also serve it
    try {
      const frontendPublicUploads = path.resolve(process.cwd(), '../frontend/public/uploads');
      const frontendPublic = path.resolve(process.cwd(), '../frontend/public');
      if (fs.existsSync(frontendPublic)) {
        if (!fs.existsSync(frontendPublicUploads)) {
          fs.mkdirSync(frontendPublicUploads, { recursive: true });
        }
        fs.copyFileSync(req.file.path, path.join(frontendPublicUploads, filename));
      }
    } catch (copyErr) {
      // Non-fatal fallback
    }

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        filename,
        url: relativeUrl,
        fullUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
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
 * List all uploaded media files in the uploads folder
 */
export const getUploadedFiles = (req, res) => {
  try {
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const files = fs.readdirSync(uploadDir);
    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;

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
 * Remove uploaded file by filename
 */
export const deleteUploadedFile = (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) {
      return res.status(400).json({ success: false, message: 'Filename is required.' });
    }

    const safeName = path.basename(filename);
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    const targetPath = path.join(uploadDir, safeName);

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    // Mirror cleanup on frontend/public/uploads
    try {
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
