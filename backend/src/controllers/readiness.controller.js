const readinessService = require('../services/readiness.service');
const Readiness = require('../models/Readiness');
const { successResponse } = require('../utils/responseFormat');

exports.getReadiness = async (req, res, next) => {
  try {
    const readiness = await Readiness.findOne({ user: req.user._id });
    if (!readiness) {
       return successResponse(res, 200, 'Readiness data not found', null);
    }
    return successResponse(res, 200, 'Readiness data', readiness);
  } catch (err) { next(err); }
};

exports.calculateReadiness = async (req, res, next) => {
  try {
    const readiness = await readinessService.calculateDeterministicScore(req.user._id);
    return successResponse(res, 200, 'Readiness calculated', readiness);
  } catch (err) { next(err); }
};

exports.getAnalysis = async (req, res, next) => {
  try {
    const readiness = await Readiness.findOne({ user: req.user._id });
    if (!readiness) {
      return res.status(404).json({ success: false, message: 'Readiness data not found' });
    }
    const analysis = {
      overallScore: readiness.overallScore,
      componentScores: readiness.components,
      strengths: readiness.strengths,
      weaknesses: readiness.weaknesses,
      recommendations: readiness.recommendations,
      lastCalculatedAt: readiness.lastCalculatedAt
    };
    return successResponse(res, 200, 'Readiness analysis', analysis);
  } catch (err) { next(err); }
};

exports.generateAiAnalysis = async (req, res, next) => {
  try {
    const readiness = await readinessService.generateAIAnalysis(req.user._id);
    return successResponse(res, 200, 'AI Analysis generated', readiness);
  } catch (err) { next(err); }
};
