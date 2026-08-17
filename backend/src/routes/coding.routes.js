const express = require('express');
const router = express.Router();
const codingController = require('../controllers/coding.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/problems', codingController.getProblems);
router.get('/progress', codingController.getProgress);
router.get('/history', codingController.getSubmissionHistory);
router.get('/problems/:id', codingController.getProblemById);
router.post('/problems/:id/submit', codingController.submitCode);

module.exports = router;
