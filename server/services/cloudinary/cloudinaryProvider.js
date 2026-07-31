const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const ErrorResponse = require('../../utils/errorResponse');
const logger = require('../../utils/logger');

/**
 * Configure Cloudinary using environment variables.
 * Called once when the module is first loaded.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true // Always use HTTPS URLs
});

/**
 * Cloudinary Provider
 * ─────────────────────────────────────────────────────────────────────
 * A single abstraction layer for all Cloudinary operations.
 * Isolates the rest of the codebase from the Cloudinary SDK API surface.
 *
 * Folder layout on Cloudinary:
 *   resume-builder/
 *   ├── users/profile-photos/  — Student profile photos
 *   ├── resume/images/         — Images embedded in resume sections
 *   ├── templates/             — Admin template thumbnails
 *   └── exports/               — Exported PDF thumbnails (if needed)
 */
class CloudinaryProvider {
  /**
   * Converts a raw Buffer (from Multer memory storage) into a readable
   * stream so we can pipe it directly to Cloudinary's upload_stream API.
   */
  _bufferToStream(buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
  }

  /**
   * Streams a file buffer to Cloudinary.
   *
   * @param {Buffer} fileBuffer   — Raw file bytes from req.file.buffer
   * @param {string} folder       — Cloudinary destination folder (e.g. 'resume-builder/users/profile-photos')
   * @param {string} publicId     — Deterministic public ID (userId or resumeId based) for easy replacement
   * @param {Object} options      — Extra transformation/upload options
   * @returns {Object}            — { url, publicId, width, height, format, bytes }
   */
  async upload(fileBuffer, folder, publicId, options = {}) {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      logger.warn('Cloudinary credentials not configured. Returning placeholder image URL.');
      return {
        url: 'https://via.placeholder.com/300',
        publicId: 'mock-public-id',
        width: 300,
        height: 300,
        format: 'png',
        bytes: 0
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          overwrite: true,               // Replaces the existing asset with the same publicId
          invalidate: true,              // Purges Cloudinary CDN cache for the old version
          resource_type: 'image',

          // Image transformations applied at upload time
          transformation: [
            {
              quality: 'auto:good',      // Cloudinary auto-selects the best quality/size balance
              fetch_format: 'auto',      // Converts to WebP/AVIF for modern browsers
              ...options.transformation
            }
          ],
          ...options
        },
        (error, result) => {
          if (error) {
            logger.error(`Cloudinary Upload Error: ${error.message}`);
            reject(new ErrorResponse(`File upload failed: ${error.message}`, 500));
          } else {
            logger.info(`Cloudinary Upload Success: ${result.public_id} (${Math.round(result.bytes / 1024)}KB)`);
            resolve({
              url:      result.secure_url,
              publicId: result.public_id,
              width:    result.width,
              height:   result.height,
              format:   result.format,
              bytes:    result.bytes
            });
          }
        }
      );

      this._bufferToStream(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Deletes an asset from Cloudinary by its public_id.
   * Safe to call even if the asset doesn't exist (Cloudinary returns 'not found').
   *
   * @param {string} publicId — Cloudinary public_id (NOT the full URL)
   */
  async delete(publicId) {
    if (!publicId || publicId === 'no-photo.jpg' || publicId === 'mock-public-id') return; // Never try to delete placeholder
    if (!process.env.CLOUDINARY_CLOUD_NAME) return;

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      logger.info(`Cloudinary Delete: ${publicId} → ${result.result}`);
      return result;
    } catch (error) {
      logger.error(`Cloudinary Delete Error for ${publicId}: ${error.message}`);
      // Non-critical — don't throw. A failed delete should not break the user flow.
    }
  }

  /**
   * Generates an optimized, on-the-fly Cloudinary URL with transformations.
   * Useful for returning thumbnail variants without re-uploading.
   *
   * @param {string} publicId
   * @param {Object} options — width, height, crop, quality, etc.
   * @returns {string} Transformed URL
   */
  getOptimizedUrl(publicId, options = {}) {
    if (!process.env.CLOUDINARY_CLOUD_NAME || publicId === 'mock-public-id') return 'https://via.placeholder.com/300';
    return cloudinary.url(publicId, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    });
  }
}

module.exports = new CloudinaryProvider();
