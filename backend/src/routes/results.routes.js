const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/results.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /results:
 *   get:
 *     summary: Get results data
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/', authenticate, resultsController.getUserResults);
router.get('/:id', authenticate, resultsController.getResultById);

module.exports = router;
