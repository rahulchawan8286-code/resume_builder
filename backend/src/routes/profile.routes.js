const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get profile data
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/', authenticate, profileController.placeholder);

module.exports = router;
