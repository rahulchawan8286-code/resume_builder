const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get admin data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/', authenticate, adminController.placeholder);
router.post('/seed-de-quiz', authenticate, authorize('admin'), adminController.seedDEQuiz);

module.exports = router;
