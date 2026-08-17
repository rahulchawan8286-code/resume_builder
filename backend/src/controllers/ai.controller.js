const careerIntelligenceService = require('../services/careerIntelligence.service');
const { successResponse } = require('../utils/responseFormat');

exports.getCareerAnalysis = async (req, res, next) => {
  try {
    const analysis = await careerIntelligenceService.getCareerInsights(req.user._id, false);
    return successResponse(res, 200, 'Career analysis fetched successfully', analysis);
  } catch (error) {
    next(error);
  }
};

exports.refreshCareerAnalysis = async (req, res, next) => {
  try {
    const analysis = await careerIntelligenceService.getCareerInsights(req.user._id, true);
    return successResponse(res, 200, 'Career analysis refreshed successfully', analysis);
  } catch (error) {
    next(error);
  }
};
