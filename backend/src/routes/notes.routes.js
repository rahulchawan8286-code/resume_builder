const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get notes data
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/', authenticate, notesController.placeholder);

module.exports = router;
