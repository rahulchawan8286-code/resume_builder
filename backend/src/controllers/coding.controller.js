const CodingProblem = require('../models/CodingProblem');
const CodeSubmission = require('../models/CodeSubmission');
const { successResponse, errorResponse } = require('../utils/responseFormat');
const { calculateDeterministicScore } = require('../services/readiness.service');

exports.getProblems = async (req, res, next) => {
  try {
    const { difficulty, topic } = req.query;
    let query = {};
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.tags = topic;

    const problems = await CodingProblem.find(query).select('-testCases -starterCode');
    
    // Fetch user's submissions to mark solved/unsolved
    const submissions = await CodeSubmission.find({ user: req.user.id });
    const submissionMap = {};
    submissions.forEach(sub => {
      // Keep best status
      if (!submissionMap[sub.problem] || sub.status === 'Accepted') {
        submissionMap[sub.problem] = sub.status;
      }
    });

    const enrichedProblems = problems.map(p => ({
      ...p.toObject(),
      status: submissionMap[p._id] || 'Unsolved'
    }));

    return successResponse(res, 200, 'Coding problems retrieved successfully', enrichedProblems);
  } catch (error) {
    next(error);
  }
};

exports.getProblemById = async (req, res, next) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) return errorResponse(res, 404, 'Problem not found');

    // Remove hidden test cases
    const safeProblem = problem.toObject();
    if (safeProblem.testCases) {
      safeProblem.testCases = safeProblem.testCases.filter(tc => !tc.isHidden);
    }

    const submissions = await CodeSubmission.find({ user: req.user.id, problem: req.params.id }).sort({ createdAt: -1 });
    const bestStatus = submissions.some(s => s.status === 'Accepted') ? 'Accepted' : (submissions.length > 0 ? submissions[0].status : 'Unsolved');

    return successResponse(res, 200, 'Problem retrieved successfully', { problem: safeProblem, status: bestStatus });
  } catch (error) {
    next(error);
  }
};

exports.submitCode = async (req, res, next) => {
  try {
    const { language, code } = req.body;
    const problemId = req.params.id;

    if (!language || !code) {
      return errorResponse(res, 400, 'Language and code are required');
    }

    const problem = await CodingProblem.findById(problemId);
    if (!problem) return errorResponse(res, 404, 'Problem not found');

    // Simulate code submission as 'Pending' since we don't have secure execution
    const submission = new CodeSubmission({
      user: req.user.id,
      problem: problemId,
      language,
      code,
      status: 'Pending'
    });

    await submission.save();

    // Calling readiness update (even though Pending doesn't currently add to score, it's good practice)
    calculateDeterministicScore(req.user.id).catch(err => console.error('Readiness update error:', err));

    return successResponse(res, 201, 'Code submitted successfully. Execution is currently unavailable.', submission);
  } catch (error) {
    next(error);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const submissions = await CodeSubmission.find({ user: req.user.id }).populate('problem', 'difficulty tags');
    
    const stats = {
      attempted: 0,
      solved: 0, // Solved means Accepted
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      topicProgress: {}
    };

    const attemptedSet = new Set();
    const solvedSet = new Set();

    submissions.forEach(sub => {
      attemptedSet.add(sub.problem._id.toString());
      if (sub.status === 'Accepted') {
        if (!solvedSet.has(sub.problem._id.toString())) {
          solvedSet.add(sub.problem._id.toString());
          stats.solved++;
          
          if (sub.problem.difficulty === 'Easy') stats.easySolved++;
          if (sub.problem.difficulty === 'Medium') stats.mediumSolved++;
          if (sub.problem.difficulty === 'Hard') stats.hardSolved++;

          sub.problem.tags.forEach(tag => {
            stats.topicProgress[tag] = (stats.topicProgress[tag] || 0) + 1;
          });
        }
      }
    });

    stats.attempted = attemptedSet.size;

    return successResponse(res, 200, 'Progress retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

exports.getSubmissionHistory = async (req, res, next) => {
  try {
    const submissions = await CodeSubmission.find({ user: req.user.id })
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 });
    
    return successResponse(res, 200, 'History retrieved successfully', submissions);
  } catch (error) {
    next(error);
  }
};
