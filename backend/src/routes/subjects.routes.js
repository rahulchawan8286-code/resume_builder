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

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Get subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Subject not found
 */
router.get('/:id', authenticate, subjectsController.getSubjectById);

module.exports = router;
