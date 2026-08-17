const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/career-analysis', authenticate, aiController.getCareerAnalysis);
router.post('/career-analysis/refresh', authenticate, aiController.refreshCareerAnalysis);

module.exports = router;
