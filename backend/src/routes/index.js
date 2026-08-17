const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const subjectsRoutes = require('./subjects.routes');
const quizzesRoutes = require('./quizzes.routes');
const resultsRoutes = require('./results.routes');
// Auto-load other routes here later...

router.use('/auth', authRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/quizzes', quizzesRoutes);
router.use('/results', resultsRoutes);
router.use('/coding', require('./coding.routes'));
router.use('/ai', require('./ai.routes'));

module.exports = router;
