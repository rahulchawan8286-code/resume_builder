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
router.use('/readiness', require('./readiness.routes'));
router.use('/company', require('./company.routes'));
router.use('/roadmap', require('./roadmap.routes'));
router.use('/resume', require('./resume.routes'));
router.use('/interviews', require('./interview.routes'));
router.use('/notes', require('./notes.routes'));

module.exports = router;
