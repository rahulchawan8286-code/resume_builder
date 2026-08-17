const Subject = require('../models/Subject');
const { successResponse, errorResponse } = require('../utils/responseFormat');

exports.getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ isActive: true }).sort({ name: 1 });
    return successResponse(res, 200, 'Subjects fetched successfully', subjects);
  } catch (error) {
    next(error);
  }
};
