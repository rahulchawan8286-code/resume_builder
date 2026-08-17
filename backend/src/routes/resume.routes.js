const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /resume:
 *   get:
 *     summary: Get resume data
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.use(authenticate);

router.get('/templates', resumeController.getTemplates);

router.get('/', resumeController.getResumes);
router.post('/', resumeController.createResume);

router.get('/:id', resumeController.getResumeById);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

router.post('/:id/duplicate', resumeController.duplicateResume);

router.get('/:id/ats', resumeController.getATSReport);
router.post('/:id/analyze', resumeController.analyzeATS);

module.exports = router;
