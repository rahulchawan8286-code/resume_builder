const express = require('express');
const router = express.Router();
const quizzesController = require('../controllers/quizzes.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Get quizzes data
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/', authenticate, quizzesController.getQuizzes);
router.get('/:id/questions', authenticate, quizzesController.getQuizQuestions);
router.post('/:id/submit', authenticate, quizzesController.submitQuiz);

module.exports = router;
