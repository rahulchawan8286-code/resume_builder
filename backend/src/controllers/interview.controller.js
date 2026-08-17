const interviewService = require('../services/interview.service');
const InterviewSession = require('../models/InterviewSession');
const { successResponse } = require('../utils/responseFormat');

exports.startSession = async (req, res, next) => {
  try {
    const { sessionType, difficulty, targetCompanyId } = req.body;
    
    // Generate personalized questions based on context
    const questions = await interviewService.generateQuestions(req.user._id, targetCompanyId, sessionType, difficulty);

    const session = new InterviewSession({
      user: req.user._id,
      targetCompany: targetCompanyId || null,
      sessionType,
      difficulty,
      questions
    });

    await session.save();
    return successResponse(res, 201, 'Interview session started', session);
  } catch (err) { next(err); }
};

exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .select('-questions'); // Exclude large questions array for list view
    return successResponse(res, 200, 'Sessions fetched', sessions);
  } catch (err) { next(err); }
};

exports.getSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    return successResponse(res, 200, 'Session fetched', session);
  } catch (err) { next(err); }
};

exports.submitAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionId, answer } = req.body;
    
    const session = await InterviewSession.findOne({ _id: id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.status === 'Completed') return res.status(400).json({ success: false, message: 'Session already completed' });

    const question = session.questions.id(questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    question.userAnswer = answer;
    question.answeredAt = new Date();

    try {
      const evaluation = await interviewService.evaluateAnswer(question, answer);
      question.score = evaluation.score;
      question.feedback = evaluation.feedback;
      question.strengths = evaluation.strengths;
      question.weaknesses = evaluation.weaknesses;
      question.missingConcepts = evaluation.missingConcepts;
      question.improvementSuggestion = evaluation.improvementSuggestion;
      question.evaluationFailed = false;
    } catch (evalError) {
      console.error('Answer Evaluation Failed:', evalError.message);
      question.evaluationFailed = true;
      question.score = null;
      question.feedback = 'Evaluation failed. Please retry.';
    }

    await session.save();

    if (question.evaluationFailed) {
      return res.status(400).json({ success: false, message: 'Answer saved, but AI evaluation failed.', question });
    }

    return successResponse(res, 200, 'Answer submitted and evaluated', question);
  } catch (err) { next(err); }
};

exports.finishSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate isolation check within service
    const session = await interviewService.finishSession(id, req.user._id);
    
    return successResponse(res, 200, 'Session finished and scored', session);
  } catch (err) { next(err); }
};

exports.getPerformance = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id, status: 'Completed' }).sort({ createdAt: -1 });
    
    if (sessions.length === 0) {
      return successResponse(res, 200, 'No performance data yet', null);
    }

    // Basic aggregate
    const aggregate = {
      overall: Math.round(sessions.reduce((a,b)=>a+(b.overallScore||0),0)/sessions.length),
      history: sessions.map(s => ({ date: s.completedAt, score: s.overallScore, type: s.sessionType }))
    };

    return successResponse(res, 200, 'Performance fetched', aggregate);
  } catch (err) { next(err); }
};
