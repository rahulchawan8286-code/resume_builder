const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/', authenticate, usersController.placeholder);

module.exports = router;
