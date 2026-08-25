const express = require('express');
const {
  uploadProfilePhoto,
  uploadResumeImage,
  deleteFile,
  getOptimizedUrl
} = require('../controllers/uploadController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All upload routes require authentication
router.use(protect);

/**
 * POST /api/v1/upload/profile-photo
 * Multer 'single' middleware validates MIME type and 2MB limit before the controller runs.
 */
router.post('/profile-photo', upload.single('photo'), uploadProfilePhoto);

/**
 * POST /api/v1/upload/resume-image
 * Body must also contain { resumeId: "<id>" }
 */
router.post('/resume-image', upload.single('image'), uploadResumeImage);

/**
 * GET /api/v1/upload/optimize?publicId=<base64>&width=400&height=400
 */
router.get('/optimize', getOptimizedUrl);

/**
 * DELETE /api/v1/upload/:publicId
 * publicId must be base64-url-encoded to safely pass slashes in URL.
 * e.g. btoa('resume-builder/users/profile-photos/user_abc') on the frontend.
 */
router.delete('/:publicId', deleteFile);

module.exports = router;
