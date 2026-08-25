const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

// --- Allowed types (double-checked: both MIME type AND file extension) ---
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = /\.(jpeg|jpg|png|webp)$/i;

// Multer memory storage — buffers file in RAM, then we stream directly to Cloudinary.
// We never write uploads to disk, eliminating temp-file cleanup issues.
const storage = multer.memoryStorage();

/**
 * Double-validation file filter:
 * 1. Checks MIME type sent by the browser (can be spoofed, so checked first)
 * 2. Checks the file extension (secondary guard)
 * Both must pass.
 */
const fileFilter = (req, file, cb) => {
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk  = ALLOWED_EXTENSIONS.test(path.extname(file.originalname));

  if (mimeOk && extOk) {
    return cb(null, true);
  }

  logger.warn(`Rejected file upload: ${file.originalname} (MIME: ${file.mimetype})`);
  cb(new ErrorResponse('Only JPEG, JPG, PNG, and WEBP images are allowed.', 400), false);
};

/**
 * Standard upload instance — 2MB limit for profile photos and resume images.
 */
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },  // 2MB
  fileFilter
});

/**
 * Multer error forwarding middleware.
 * Wraps any route that uses Multer and converts MulterErrors to our
 * standardized ErrorResponse format before passing to the global handler.
 *
 * Usage: router.post('/profile-photo', handleMulterError(upload.single('photo')), controller)
 *
 * Note: For simplicity, upload routes use upload.single() directly.
 * This wrapper is exported separately for advanced route-level control.
 */
const handleMulterError = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ErrorResponse('File too large. Maximum allowed size is 2MB.', 400));
      }
      return next(new ErrorResponse(err.message, 400));
    }
    if (err) return next(err);
    next();
  });
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;
