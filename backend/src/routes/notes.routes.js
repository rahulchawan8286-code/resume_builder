const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /notes/subject/{subjectId}:
 *   get:
 *     summary: Get notes by subject ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/subject/:subjectId', authenticate, notesController.getNotesBySubject);

module.exports = router;
