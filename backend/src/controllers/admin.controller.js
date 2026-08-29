const { successResponse, errorResponse } = require('../utils/responseFormat');
const seedDigitalElectronicsQuiz = require('../scripts/seedDigitalElectronicsQuiz');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Subject = require('../models/Subject');

exports.placeholder = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'admin endpoint is working');
  } catch (error) {
    next(error);
  }
};

exports.seedDEQuiz = async (req, res, next) => {
  try {
    // 1. Run the idempotent seed script
    await seedDigitalElectronicsQuiz();

    // 2. Self-verify the database
    const subject = await Subject.findOne({ 
      $or: [{ code: 'ECE-DE' }, { name: 'Digital Electronics' }] 
    });
    
    if (!subject) {
      throw new Error('Digital Electronics subject not found after seeding.');
    }

    const quiz = await Quiz.findOne({ subject: subject._id, title: 'Digital Electronics Practice Test' });
    if (!quiz) {
      throw new Error('Digital Electronics Practice Test quiz not found after seeding.');
    }

    const count = await Question.countDocuments({ quiz: quiz._id });
    if (count !== 30) {
      throw new Error(`Production quiz verification failed: ${count}/30 questions`);
    }

    // 3. Return exact verification counts
    return successResponse(res, 200, 'Production digital electronics quiz successfully verified', {
      subjectId: subject._id,
      quizId: quiz._id,
      questionCount: count
    });
  } catch (error) {
    console.error('Admin seed error:', error);
    next(error);
  }
};
