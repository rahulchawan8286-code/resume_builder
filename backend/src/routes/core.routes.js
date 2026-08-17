const express = require('express');
const router = express.Router();
const coreController = require('../controllers/core.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /core:
 *   get:
 *     summary: Get core data
 *     tags: [Core]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/', authenticate, coreController.placeholder);

module.exports = router;
