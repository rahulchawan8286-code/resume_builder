const Result = require('../models/Result');
const { successResponse, errorResponse } = require('../utils/responseFormat');

exports.getUserResults = async (req, res, next) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .populate('quiz', 'title timeLimit subject')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Results fetched successfully', results);
  } catch (error) {
    next(error);
  }
};

exports.getResultById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Result.findOne({ _id: id, user: req.user.id })
      .populate('quiz', 'title passingScore timeLimit subject');

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    return successResponse(res, 200, 'Result fetched successfully', result);
  } catch (error) {
    next(error);
  }
};
