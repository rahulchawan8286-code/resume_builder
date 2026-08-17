const roadmapService = require('../services/roadmap.service');
const Roadmap = require('../models/Roadmap');
const { successResponse } = require('../utils/responseFormat');

exports.getRoadmap = async (req, res, next) => {
  try {
    const { targetCompanyId } = req.query;
    const query = { user: req.user._id };
    if (targetCompanyId) query.targetCompany = targetCompanyId;
    else query.targetCompany = null; // or handle default
    
    const roadmap = await Roadmap.findOne(query).populate('targetCompany', 'name');
    if (!roadmap) {
      return successResponse(res, 200, 'Roadmap not found', null);
    }
    return successResponse(res, 200, 'Roadmap fetched', roadmap);
  } catch (err) { next(err); }
};

exports.generateRoadmap = async (req, res, next) => {
  try {
    const { targetCompanyId } = req.body;
    const roadmap = await roadmapService.generateDeterministicRoadmap(req.user._id, targetCompanyId);
    await roadmap.populate('targetCompany', 'name');
    return successResponse(res, 200, 'Roadmap generated', roadmap);
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { isCompleted } = req.body;
    
    // Strict user isolation check
    const roadmap = await Roadmap.findOne({ user: req.user._id, "weeks.tasks._id": taskId });
    if (!roadmap) {
      return res.status(403).json({ success: false, message: 'Unauthorized or task not found.' });
    }

    // Update task
    roadmap.weeks.forEach(w => {
      w.tasks.forEach(t => {
        if (t._id.toString() === taskId) {
          t.isCompleted = isCompleted;
          t.completedAt = isCompleted ? new Date() : null;
        }
      });
    });

    await roadmap.save();

    // Recalculate progress via service
    const progress = await roadmapService.calculateProgress(roadmap._id);

    return successResponse(res, 200, 'Task updated', { progress });
  } catch (err) { next(err); }
};

exports.getProgress = async (req, res, next) => {
  try {
    const { targetCompanyId } = req.query;
    const query = { user: req.user._id };
    if (targetCompanyId) query.targetCompany = targetCompanyId;
    else query.targetCompany = null;
    
    const roadmap = await Roadmap.findOne(query);
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
    return successResponse(res, 200, 'Progress fetched', { progress: roadmap.overallProgress });
  } catch (err) { next(err); }
};

exports.getSkillGaps = async (req, res, next) => {
  try {
    const { targetCompanyId } = req.query;
    const query = { user: req.user._id };
    if (targetCompanyId) query.targetCompany = targetCompanyId;
    else query.targetCompany = null;
    
    const roadmap = await Roadmap.findOne(query);
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
    return successResponse(res, 200, 'Skill gaps fetched', roadmap.skillGaps);
  } catch (err) { next(err); }
};

exports.aiPersonalize = async (req, res, next) => {
  try {
    const { targetCompanyId } = req.body;
    const roadmap = await roadmapService.aiPersonalizeRoadmap(req.user._id, targetCompanyId);
    return successResponse(res, 200, 'Roadmap enhanced with AI', roadmap);
  } catch (err) { next(err); }
};
