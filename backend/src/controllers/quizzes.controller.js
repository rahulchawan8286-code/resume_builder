const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { calculateDeterministicScore } = require('../services/readiness.service');
const { successResponse, errorResponse } = require('../utils/responseFormat');

exports.getQuizzes = async (req, res, next) => {
  try {
    const { subject } = req.query;
    const query = { isActive: true };
    if (subject) query.subject = subject;

    const quizzes = await Quiz.find(query).populate('subject', 'name code').sort({ title: 1 });
    return successResponse(res, 200, 'Quizzes fetched successfully', quizzes);
  } catch (error) {
    next(error);
  }
};

exports.getQuizQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOne({ _id: id, isActive: true }).populate('subject', 'name');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Fetch questions and explicitly DO NOT send isCorrect
    const questions = await Question.find({ quiz: id }).select('-__v -createdAt -updatedAt -explanation');
    
    // Strip isCorrect manually to be absolutely safe
    const sanitizedQuestions = questions.map(q => {
      const qObj = q.toObject();
      qObj.options = qObj.options.map(opt => ({
        _id: opt._id,
        text: opt.text
      }));
      return qObj;
    });

    return successResponse(res, 200, 'Questions fetched successfully', {
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        timeLimit: quiz.timeLimit,
        subject: quiz.subject
      },
      questions: sanitizedQuestions
    });
  } catch (error) {
    next(error);
  }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // format: { questionId: selectedOptionId }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid answers format' });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const questions = await Question.find({ quiz: id });
    if (questions.length === 0) return res.status(400).json({ success: false, message: 'Quiz has no questions' });

    let score = 0;
    const resultAnswers = [];

    // Evaluate answers
    for (const question of questions) {
      const selectedOptionId = answers[question._id.toString()];
      let isCorrect = false;

      if (selectedOptionId) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && correctOption._id.toString() === selectedOptionId) {
          isCorrect = true;
          score++;
        }
      }

      resultAnswers.push({
        question: question._id,
        selectedOption: selectedOptionId || null,
        isCorrect
      });
    }

    const percentage = (score / questions.length) * 100;
    const passed = percentage >= quiz.passingScore;

    // Create Result
    const result = await Result.create({
      user: req.user.id,
      quiz: quiz._id,
      score,
      totalQuestions: questions.length,
      answers: resultAnswers,
      passed
    });

    // Fire & forget readiness calculation - if it fails we don't want to crash the request since Result is saved
    calculateDeterministicScore(req.user.id).catch(err => {
      console.error(`Failed to update readiness for user ${req.user.id}:`, err);
    });

    return successResponse(res, 201, 'Quiz submitted successfully', {
      resultId: result._id,
      score,
      percentage,
      passed
    });
  } catch (error) {
    next(error);
  }
};
