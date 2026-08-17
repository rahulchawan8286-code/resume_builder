const router = require('express').Router();
const c = require('../controllers/roadmap.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, c.getRoadmap);
router.post('/generate', authenticate, c.generateRoadmap);
router.put('/tasks/:taskId', authenticate, c.updateTask);
router.get('/progress', authenticate, c.getProgress);
router.get('/skill-gaps', authenticate, c.getSkillGaps);
router.post('/ai-personalize', authenticate, c.aiPersonalize);

module.exports = router;
