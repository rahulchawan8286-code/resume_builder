const UserProgress = require('../models/UserProgress');
const { successResponse, errorResponse } = require('../utils/responseFormat');

exports.getProgress = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    let progress = await UserProgress.findOne({ user: req.user._id, subject: subjectId });
    
    if (!progress) {
      progress = await UserProgress.create({
        user: req.user._id,
        subject: subjectId,
        completedChapters: [],
        mcqScores: []
      });
    }
    
    return successResponse(res, 200, 'Progress fetched successfully', progress);
  } catch (error) {
    next(error);
  }
};

exports.markChapterCompleted = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { chapterId } = req.body;
    
    if (!chapterId) {
      return errorResponse(res, 400, 'Chapter ID is required');
    }

    const progress = await UserProgress.findOneAndUpdate(
      { user: req.user._id, subject: subjectId },
      { 
        $addToSet: { completedChapters: chapterId },
        $set: { lastStudiedChapter: chapterId }
      },
      { new: true, upsert: true }
    );
    
    return successResponse(res, 200, 'Chapter marked as completed', progress);
  } catch (error) {
    next(error);
  }
};

exports.saveMcqScore = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { chapterId, score, total } = req.body;

    if (!chapterId || score === undefined || total === undefined) {
      return errorResponse(res, 400, 'Chapter ID, score, and total are required');
    }

    // Pull any existing score for this chapter to avoid duplicates, then push the new one
    await UserProgress.updateOne(
      { user: req.user._id, subject: subjectId },
      { $pull: { mcqScores: { chapter: chapterId } } }
    );

    const progress = await UserProgress.findOneAndUpdate(
      { user: req.user._id, subject: subjectId },
      { 
        $push: { mcqScores: { chapter: chapterId, score, total } },
        $set: { lastStudiedChapter: chapterId }
      },
      { new: true, upsert: true }
    );
    
    return successResponse(res, 200, 'MCQ score saved successfully', progress);
  } catch (error) {
    next(error);
  }
};
