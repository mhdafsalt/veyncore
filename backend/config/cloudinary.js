import { v2 as cloudinary } from 'cloudinary';

/**
 * Check if all required Cloudinary environment variables are configured
 */
export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Initialize Cloudinary configuration if credentials exist
 */
if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload a file buffer directly to Cloudinary using upload_stream
 * Avoids writing any temporary files to disk, making it 100% serverless-safe.
 * @param {Buffer} buffer File buffer from multer memoryStorage
 * @param {Object} options Cloudinary upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error('Cloudinary credentials are not configured in environment variables.'));
    }

    const uploadOptions = {
      folder: options.folder || 'veyncore_uploads',
      resource_type: options.resourceType || 'auto',
      public_id: options.publicId,
      overwrite: options.overwrite !== false,
      use_filename: true,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    stream.end(buffer);
  });
};

/**
 * Delete an asset from Cloudinary by public ID
 * @param {string} publicId Cloudinary public_id
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured() || !publicId) return null;
  return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
