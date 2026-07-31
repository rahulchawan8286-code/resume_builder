const express = require('express');
const { generatePdf, previewPdf, printPdf } = require('../controllers/pdfController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { generatePdfSchema, printPdfSchema } = require('../validators/pdfValidator');

const router = express.Router();

// All PDF routes require a logged-in user
router.use(protect);

// POST /api/v1/pdf/generate  — download PDF
router.post('/generate', validate(generatePdfSchema), generatePdf);

// GET  /api/v1/pdf/:resumeId — inline browser preview
router.get('/:resumeId', previewPdf);

// POST /api/v1/pdf/print     — print-optimized (no margins/footer)
router.post('/print', validate(printPdfSchema), printPdf);

module.exports = router;
