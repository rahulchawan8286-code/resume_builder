const Note = require('../models/Note');
const { successResponse, errorResponse } = require('../utils/responseFormat');
  
exports.getNotesBySubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    
    // Validate subjectId exists
    if (!subjectId) {
      return errorResponse(res, 400, 'Subject ID is required');
    }

    // Find notes for this subject and sort them chronologically or by ID to maintain order
    const notes = await Note.find({ subject: subjectId, isPublic: true })
      .populate('subject', 'name')
      .sort({ _id: 1 });
    
    return successResponse(res, 200, 'Notes fetched successfully', notes);
  } catch (error) {
    next(error);
  }
};
