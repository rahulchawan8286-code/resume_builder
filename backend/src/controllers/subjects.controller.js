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

exports.getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }
    return successResponse(res, 200, 'Subject fetched successfully', subject);
  } catch (error) {
    next(error);
  }
};
