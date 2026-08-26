const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/subject/:subjectId', progressController.getProgress);
router.post('/subject/:subjectId/complete', progressController.markChapterCompleted);
router.post('/subject/:subjectId/mcq', progressController.saveMcqScore);

module.exports = router;
