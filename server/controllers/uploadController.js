const fileService     = require('../services/fileService');
const formatResponse  = require('../utils/responseFormatter');

/**
 * POST /api/v1/upload/profile-photo
 * Multer (single) middleware must run before this controller.
 */
exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(
        formatResponse(false, 'No file uploaded. Please attach an image.', null, null)
      );
    }

    const result = await fileService.uploadProfilePhoto(
      req.user.id,
      req.file.buffer,
      req.file.mimetype
    );

    res.status(200).json(formatResponse(true, 'Profile photo uploaded successfully', result));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/upload/resume-image
 */
exports.uploadResumeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(
        formatResponse(false, 'No file uploaded.', null, null)
      );
    }

    const { resumeId } = req.body;
    if (!resumeId) {
      return res.status(400).json(
        formatResponse(false, 'resumeId is required in the request body.', null, null)
      );
    }

    const result = await fileService.uploadResumeImage(
      req.user.id,
      resumeId,
      req.file.buffer
    );

    res.status(200).json(formatResponse(true, 'Resume image uploaded successfully', result));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/upload/:publicId
 * The publicId must be base64-url-encoded by the frontend to avoid slash issues in the URL param.
 */
exports.deleteFile = async (req, res, next) => {
  try {
    // Decode the public ID from the URL param
    const publicId = Buffer.from(req.params.publicId, 'base64').toString('utf8');

    await fileService.deleteFile(publicId, req.user.id);
    res.status(200).json(formatResponse(true, 'File deleted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/upload/optimize
 * Returns an optimized variant URL for any public asset owned by the user.
 */
exports.getOptimizedUrl = async (req, res, next) => {
  try {
    const { publicId, width, height } = req.query;
    if (!publicId) {
      return res.status(400).json(
        formatResponse(false, 'publicId query param is required', null, null)
      );
    }

    const url = fileService.getOptimizedUrl(
      Buffer.from(publicId, 'base64').toString('utf8'),
      parseInt(width) || 200,
      parseInt(height) || 200
    );

    res.status(200).json(formatResponse(true, 'Optimized URL generated', { url }));
  } catch (error) {
    next(error);
  }
};
