const cloudinaryProvider = require('./cloudinary/cloudinaryProvider');
const userRepository     = require('../repositories/userRepository');
const resumeRepository   = require('../repositories/resumeRepository');
const ErrorResponse      = require('../utils/errorResponse');
const logger             = require('../utils/logger');

/**
 * Cloudinary Folder Constants
 * Keep all folder paths defined in a single place to prevent typos.
 */
const FOLDERS = {
  PROFILE_PHOTOS: 'resume-builder/users/profile-photos',
  RESUME_IMAGES:  'resume-builder/resume/images',
  TEMPLATES:      'resume-builder/templates',
  EXPORTS:        'resume-builder/exports'
};

class FileService {
  /**
   * Upload a user's profile photo.
   *
   * Strategy:
   * 1. Validate the user exists.
   * 2. If the user already has a photo (and it's not the placeholder),
   *    DELETE the old Cloudinary asset first to avoid orphaned files.
   * 3. Upload the new file using the userId as the deterministic public_id.
   *    Using the userId means the same user always writes to the same Cloudinary slot —
   *    so Cloudinary's `overwrite: true` makes the delete step mostly redundant,
   *    but we still call delete to ensure CDN cache invalidation is explicit.
   * 4. Persist the new URL to the User document.
   */
  async uploadProfilePhoto(userId, fileBuffer, mimetype) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ErrorResponse('User not found', 404);

    // Extract the old public_id from the stored URL so we can invalidate it
    const oldPublicId = this._extractPublicId(user.profilePhoto);

    // Upload new file — public_id is deterministic: users/{userId}
    const result = await cloudinaryProvider.upload(
      fileBuffer,
      FOLDERS.PROFILE_PHOTOS,
      `user_${userId}`,
      {
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Auto face-center crop
          { quality: 'auto:good', fetch_format: 'auto' }
        ]
      }
    );

    // Delete the old asset AFTER successful upload (so we don't orphan on upload error)
    if (oldPublicId && oldPublicId !== 'no-photo') {
      await cloudinaryProvider.delete(oldPublicId);
    }

    // Persist the new URL
    await userRepository.update(user, { profilePhoto: result.url });

    logger.info(`Profile photo updated for user: ${userId} → ${result.url}`);
    return { url: result.url, publicId: result.publicId, bytes: result.bytes };
  }

  /**
   * Upload an image to embed inside a resume section (e.g. project screenshot).
   * Public_id is scoped to resumeId + a timestamp for uniqueness.
   */
  async uploadResumeImage(userId, resumeId, fileBuffer) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    if (resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to upload to this resume', 403);
    }

    const publicId = `resume_${resumeId}_${Date.now()}`;
    const result = await cloudinaryProvider.upload(
      fileBuffer,
      FOLDERS.RESUME_IMAGES,
      publicId,
      {
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      }
    );

    logger.info(`Resume image uploaded for resume: ${resumeId}`);
    return { url: result.url, publicId: result.publicId, bytes: result.bytes };
  }

  /**
   * Delete a Cloudinary asset.
   * Guards: only allow deletion of assets that belong to the allowed folders.
   *
   * @param {string} publicId — Full Cloudinary public_id (e.g. 'resume-builder/users/profile-photos/user_abc123')
   * @param {string} userId
   */
  async deleteFile(publicId, userId) {
    // Security: only allow deletion within our app's folder scope
    if (!publicId.startsWith('resume-builder/')) {
      throw new ErrorResponse('Invalid asset reference', 400);
    }

    await cloudinaryProvider.delete(publicId);
    logger.info(`File deleted by user ${userId}: ${publicId}`);
    return true;
  }

  /**
   * Get an optimized variant URL for an already-uploaded asset.
   * The frontend can use this to request resized thumbnails without extra uploads.
   */
  getOptimizedUrl(publicId, width = 200, height = 200) {
    return cloudinaryProvider.getOptimizedUrl(publicId, {
      width, height, crop: 'fill'
    });
  }

  /**
   * Extracts the Cloudinary public_id from a secure_url.
   * e.g. "https://res.cloudinary.com/demo/image/upload/v1234/resume-builder/users/profile-photos/user_abc.webp"
   *   → "resume-builder/users/profile-photos/user_abc"
   */
  _extractPublicId(url) {
    if (!url || url === 'no-photo.jpg') return null;
    try {
      // Match the path after /upload/vXXXX/ and strip file extension
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }
}

module.exports = new FileService();
