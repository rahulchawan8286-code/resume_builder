const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  generateObjective,
  generateSummary,
  enhanceExperience,
  analyzeAts,
  grammarCheck,
  generateCoverLetter,
  getHistory,
  deleteHistory
} = require('../controllers/aiController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  objectiveSchema,
  summarySchema,
  experienceSchema,
  atsSchema,
  grammarSchema,
  coverLetterSchema
} = require('../validators/aiValidator');

const router = express.Router();

// Dedicated, stricter rate limiter for AI routes (costly operations)
// 20 requests per user per 10 minutes
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many AI requests. Please wait before trying again.', data: null, errors: null },
  keyGenerator: (req) => req.user?.id || req.ip // Key per user, not IP
});

// All AI routes require authentication
router.use(protect);
router.use(aiLimiter);

// --- Generation Endpoints ---
router.post('/objective',      validate(objectiveSchema),    generateObjective);
router.post('/summary',        validate(summarySchema),      generateSummary);
router.post('/experience',     validate(experienceSchema),   enhanceExperience);
router.post('/ats',            validate(atsSchema),          analyzeAts);
router.post('/grammar',        validate(grammarSchema),      grammarCheck);
router.post('/cover-letter',   validate(coverLetterSchema),  generateCoverLetter);

// --- History Endpoints ---
router.get('/history',         getHistory);
router.delete('/history/:id',  deleteHistory);

module.exports = router;
