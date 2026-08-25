const userRepository = require('../repositories/userRepository');
const ErrorResponse = require('../utils/errorResponse');
const formatResponse = require('../utils/responseFormatter');

// @desc      Get current logged in user
// @route     GET /api/v1/users/me
// @access    Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);

    res.status(200).json(
      formatResponse(true, 'User data retrieved', { user })
    );
  } catch (error) {
    next(error);
  }
};

// @desc      Update user details
// @route     PUT /api/v1/users/updatedetails
// @access    Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      college: req.body.college,
      branch: req.body.branch,
      graduationYear: req.body.graduationYear,
      linkedin: req.body.linkedin,
      github: req.body.github,
      portfolio: req.body.portfolio,
      bio: req.body.bio
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const userToUpdate = await userRepository.findById(req.user.id);
    const user = await userRepository.update(userToUpdate, fieldsToUpdate);

    res.status(200).json(
      formatResponse(true, 'User details updated', { user })
    );
  } catch (error) {
    next(error);
  }
};

// @desc      Update profile photo (usually called after uploading to Cloudinary)
// @route     PUT /api/v1/users/profile-photo
// @access    Private
exports.updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.body.profilePhoto) {
      return next(new ErrorResponse('Please provide a profile photo URL', 400));
    }

    const userToUpdate = await userRepository.findById(req.user.id);
    const user = await userRepository.update(userToUpdate, { profilePhoto: req.body.profilePhoto });

    res.status(200).json(
      formatResponse(true, 'Profile photo updated', { user })
    );
  } catch (error) {
    next(error);
  }
};

// @desc      Soft delete user account
// @route     DELETE /api/v1/users/me
// @access    Private
exports.deleteMe = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    await userRepository.softDelete(user);

    res.status(200).json(
      formatResponse(true, 'User account deleted')
    );
  } catch (error) {
    next(error);
  }
};
