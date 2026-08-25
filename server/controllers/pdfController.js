const pdfService = require('../services/pdfService');
const logger = require('../utils/logger');

/**
 * Sets proper HTTP headers for a PDF response.
 */
const setPdfHeaders = (res, filename, isDownload = true) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `${isDownload ? 'attachment' : 'inline'}; filename="${filename}.pdf"`);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
};

/**
 * POST /api/v1/pdf/generate
 * Full-quality PDF download — triggers browser save dialog.
 */
exports.generatePdf = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    const { pdfBuffer, title } = await pdfService.generatePdf(resumeId, req.user.id);

    const safeFilename = (title || 'resume').replace(/[^a-z0-9_\-]/gi, '_');
    setPdfHeaders(res, safeFilename, true);
    res.setHeader('Content-Length', pdfBuffer.length);

    logger.info(`PDF downloaded: ${resumeId} by user: ${req.user.id}`);
    res.status(200).end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/pdf/:resumeId
 * Stream PDF inline for browser preview.
 */
exports.previewPdf = async (req, res, next) => {
  try {
    const { pdfBuffer, title } = await pdfService.previewPdf(req.params.resumeId, req.user.id);

    const safeFilename = (title || 'resume').replace(/[^a-z0-9_\-]/gi, '_');
    setPdfHeaders(res, safeFilename, false); // inline — opens in browser PDF viewer
    res.setHeader('Content-Length', pdfBuffer.length);

    res.status(200).end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/pdf/print
 * Generates a borderless, print-optimized PDF.
 */
exports.printPdf = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    const { pdfBuffer, title } = await pdfService.printPdf(resumeId, req.user.id);

    const safeFilename = (title || 'resume') + '_print';
    setPdfHeaders(res, safeFilename.replace(/[^a-z0-9_\-]/gi, '_'), true);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.status(200).end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
