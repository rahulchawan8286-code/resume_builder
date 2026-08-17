const router = require('express').Router();
const c = require('../controllers/readiness.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, c.getReadiness);
router.post('/calculate', authenticate, c.calculateReadiness);
router.get('/analysis', authenticate, c.getAnalysis);
router.post('/ai-analysis', authenticate, c.generateAiAnalysis);

module.exports = router;
