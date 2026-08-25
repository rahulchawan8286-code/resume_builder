const express = require('express');
const {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  changeStatus,
  saveVersion,
  getVersionHistory,
  restoreVersion
} = require('../controllers/resumeController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createResumeSchema, updateResumeSchema, restoreVersionSchema } = require('../validators/resumeValidator');

const router = express.Router();

// Apply auth middleware to all resume routes
router.use(protect);

// Basic CRUD
router.route('/')
  .get(getResumes)
  .post(validate(createResumeSchema), createResume);

router.route('/:id')
  .get(getResumeById)
  .put(validate(updateResumeSchema), updateResume)
  .delete(deleteResume);

// Actions
router.post('/:id/duplicate', duplicateResume);

// Status Changes (Publish/Archive)
router.post('/:id/status', changeStatus); 

// Version Control
router.post('/:id/version', saveVersion);
router.get('/:id/history', getVersionHistory);
router.post('/:id/restore', validate(restoreVersionSchema), restoreVersion);

module.exports = router;
