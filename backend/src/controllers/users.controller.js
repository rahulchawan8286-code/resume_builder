const { successResponse } = require('../utils/responseFormat');
  
exports.placeholder = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'users endpoint is working');
  } catch (error) {
    next(error);
  }
};
