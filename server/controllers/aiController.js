const aiService = require('../services/aiService');
const formatResponse = require('../utils/responseFormatter');

exports.generateObjective = async (req, res, next) => {
  try {
    const { resumeId, userData, role, experienceLevel } = req.body;
    const objectives = await aiService.generateObjective(req.user.id, resumeId, userData, role, experienceLevel);
    res.status(200).json(formatResponse(true, 'Objectives generated', { objectives }));
  } catch (error) {
    next(error);
  }
};

exports.generateSummary = async (req, res, next) => {
  try {
    const { resumeId, resumeData } = req.body;
    const summary = await aiService.generateSummary(req.user.id, resumeId, resumeData);
    res.status(200).json(formatResponse(true, 'Summary generated', { summary }));
  } catch (error) {
    next(error);
  }
};

exports.enhanceExperience = async (req, res, next) => {
  try {
    const { resumeId, company, role, description } = req.body;
    const enhanced = await aiService.enhanceExperience(req.user.id, resumeId, company, role, description);
    res.status(200).json(formatResponse(true, 'Experience enhanced', { description: enhanced }));
  } catch (error) {
    next(error);
  }
};

exports.analyzeAts = async (req, res, next) => {
  try {
    const { resumeId, resumeText, jobDescription } = req.body;
    const analysis = await aiService.analyzeAts(req.user.id, resumeId, resumeText, jobDescription);
    res.status(200).json(formatResponse(true, 'ATS Analysis complete', { analysis }));
  } catch (error) {
    next(error);
  }
};

exports.grammarCheck = async (req, res, next) => {
  try {
    const { resumeId, text } = req.body;
    const corrected = await aiService.grammarCheck(req.user.id, resumeId, text);
    res.status(200).json(formatResponse(true, 'Grammar checked', { text: corrected }));
  } catch (error) {
    next(error);
  }
};

exports.generateCoverLetter = async (req, res, next) => {
  try {
    const { resumeId, resumeData, jobDescription, companyName } = req.body;
    const coverLetter = await aiService.generateCoverLetter(req.user.id, resumeId, resumeData, jobDescription, companyName);
    res.status(200).json(formatResponse(true, 'Cover letter generated', { coverLetter }));
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const history = await aiService.getHistory(req.user.id);
    res.status(200).json(formatResponse(true, 'AI History fetched', { history }));
  } catch (error) {
    next(error);
  }
};

exports.deleteHistory = async (req, res, next) => {
  try {
    await aiService.deleteHistory(req.params.id, req.user.id);
    res.status(200).json(formatResponse(true, 'History record deleted'));
  } catch (error) {
    next(error);
  }
};
