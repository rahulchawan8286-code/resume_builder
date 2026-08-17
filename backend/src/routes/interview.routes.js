const router = require('express').Router();
const c = require('../controllers/interview.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/start', authenticate, c.startSession);
router.get('/', authenticate, c.getSessions);
router.get('/performance', authenticate, c.getPerformance);
router.get('/:id', authenticate, c.getSession);
router.post('/:id/answer', authenticate, c.submitAnswer);
router.post('/:id/finish', authenticate, c.finishSession);

module.exports = router;
