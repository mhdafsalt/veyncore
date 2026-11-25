/**
 * Image Optimization Utilities for VEYNCORE
 * Optimizes Cloudinary and external image URLs on-the-fly with auto-format (WebP/AVIF),
 * perceptual quality compression, and size capping for ultra-fast loading.
 */

export function optimizeImageUrl(url, width = 800) {
  if (!url || typeof url !== 'string') return url;

  // Cloudinary URL transformation
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // If URL already has f_auto,q_auto, replace or update width
    if (url.includes('/f_auto,q_auto')) {
      return url.replace(/\/upload\/f_auto,q_auto(?:,w_\d+)?(?:,c_limit)?\//, `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }

  return url;
}

export default optimizeImageUrl;
