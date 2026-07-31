const resumeService = require('../services/resumeService');
const formatResponse = require('../utils/responseFormatter');

exports.createResume = async (req, res, next) => {
  try {
    const resume = await resumeService.createResume(req.user.id, req.body);
    res.status(201).json(formatResponse(true, 'Resume created', { resume }));
  } catch (error) {
    next(error);
  }
};

exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await resumeService.getUserResumes(req.user.id);
    res.status(200).json(formatResponse(true, 'Resumes fetched', { resumes, count: resumes.length }));
  } catch (error) {
    next(error);
  }
};

exports.getResumeById = async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user.id);
    res.status(200).json(formatResponse(true, 'Resume fetched', { resume }));
  } catch (error) {
    next(error);
  }
};

exports.updateResume = async (req, res, next) => {
  try {
    const resume = await resumeService.updateResume(req.params.id, req.user.id, req.body);
    res.status(200).json(formatResponse(true, 'Resume updated successfully', { resume }));
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    await resumeService.deleteResume(req.params.id, req.user.id);
    res.status(200).json(formatResponse(true, 'Resume deleted successfully'));
  } catch (error) {
    next(error);
  }
};

exports.duplicateResume = async (req, res, next) => {
  try {
    const duplicate = await resumeService.duplicateResume(req.params.id, req.user.id);
    res.status(201).json(formatResponse(true, 'Resume duplicated', { resume: duplicate }));
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const resume = await resumeService.changeStatus(req.params.id, req.user.id, req.body.status);
    res.status(200).json(formatResponse(true, `Resume status changed to ${req.body.status}`, { resume }));
  } catch (error) {
    next(error);
  }
};

// Version Control Controllers
exports.saveVersion = async (req, res, next) => {
  try {
    const version = await resumeService.saveVersion(req.params.id, req.user.id);
    res.status(201).json(formatResponse(true, 'Version saved', { versionNumber: version.versionNumber }));
  } catch (error) {
    next(error);
  }
};

exports.getVersionHistory = async (req, res, next) => {
  try {
    const history = await resumeService.getVersionHistory(req.params.id, req.user.id);
    res.status(200).json(formatResponse(true, 'History fetched', { history }));
  } catch (error) {
    next(error);
  }
};

exports.restoreVersion = async (req, res, next) => {
  try {
    const restored = await resumeService.restoreVersion(req.params.id, req.body.versionNumber, req.user.id);
    res.status(200).json(formatResponse(true, 'Resume restored to older version', { resume: restored }));
  } catch (error) {
    next(error);
  }
};
