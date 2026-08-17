const express = require('express');
const router = express.Router();
const subjectsController = require('../controllers/subjects.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get subjects data
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/', authenticate, subjectsController.getAllSubjects);

module.exports = router;
