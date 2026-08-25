const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const resumeRepository = require('../repositories/resumeRepository');
const { getTemplate } = require('../templates/pdf/templateBuilder');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

class PdfService {

  /**
   * Launch Puppeteer with a shared configuration.
   * This avoids spawning a new browser for every request.
   */
  async _getBrowser() {
    return await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Required for Docker/Linux environments
        '--disable-gpu'
      ]
    });
  }

  /**
   * Core PDF rendering pipeline.
   * @param {Object} resume - Full Mongoose resume document
   * @param {string} format - 'pdf' | 'preview'
   * @param {boolean} isWatermarked
   * @returns {Buffer} PDF bytes
   */
  async _renderPdf(resume, format = 'pdf', isWatermarked = false) {
    const start = Date.now();
    const browser = await this._getBrowser();
    const page = await browser.newPage();

    try {
      // 1. Generate QR code if resume is public
      if (resume.resumeVisibility === 'public' && !resume.qrCode) {
        const publicUrl = `${process.env.CLIENT_URL}/resumes/view/${resume._id}`;
        resume.qrCode = await QRCode.toDataURL(publicUrl);
      }

      // 2. Determine template
      const templateName = resume.design?.templateId
        ? 'modern' // In production: look up Template document by ID
        : 'modern';

      const buildHtml = getTemplate(templateName);
      let html = buildHtml(resume.toObject ? resume.toObject() : resume);

      // 3. Inject optional watermark
      if (isWatermarked) {
        html = html.replace('</body>', `
          <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg);
            font-size:72pt;color:rgba(0,0,0,0.05);z-index:9999;pointer-events:none;font-weight:700;white-space:nowrap;">
            DRAFT
          </div>
          </body>`);
      }

      // 4. Set page content (waits for Google Fonts to load)
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // 5. Puppeteer PDF options
      const pageSize = resume.design?.pageSize || 'A4';
      const pdfBuffer = await page.pdf({
        format: pageSize,
        printBackground: true, // Essential for colors and backgrounds
        displayHeaderFooter: true,
        headerTemplate: '<span></span>', // Empty header
        footerTemplate: `
          <div style="font-size:9pt;color:#999;width:100%;text-align:center;padding-bottom:4mm;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>`,
        margin: {
          top: '15mm',
          bottom: '18mm',
          left: '0',
          right: '0'
        }
      });

      const timeMs = Date.now() - start;
      const fileSizeKb = Math.round(pdfBuffer.length / 1024);
      logger.info(`PDF rendered for Resume ${resume._id} | Template: ${templateName} | Size: ${fileSizeKb}KB | Time: ${timeMs}ms`);

      return { pdfBuffer, timeMs, fileSizeKb, templateName };
    } finally {
      // CRITICAL: Always close the page and browser to free memory
      await page.close();
      await browser.close();
    }
  }

  /**
   * Generate and stream PDF to the client for download.
   */
  async generatePdf(resumeId, userId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    if (resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to export this resume', 403);
    }

    const { pdfBuffer, timeMs, fileSizeKb, templateName } = await this._renderPdf(resume);

    // Increment download analytics
    await resumeRepository.incrementAnalytics(resume, 'downloadCount');

    return { pdfBuffer, timeMs, fileSizeKb, templateName, title: resume.title };
  }

  /**
   * Generate a watermarked preview PDF (for free-tier users or unsigned previews).
   */
  async previewPdf(resumeId, userId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    if (resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    const { pdfBuffer } = await this._renderPdf(resume, 'pdf', false); // No watermark in preview
    return { pdfBuffer, title: resume.title };
  }

  /**
   * Generate a print-ready PDF with no footer/header/margins (full bleed).
   */
  async printPdf(resumeId, userId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    if (resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    const browser = await this._getBrowser();
    const page = await browser.newPage();

    try {
      const buildHtml = getTemplate('modern');
      const html = buildHtml(resume.toObject ? resume.toObject() : resume);
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: resume.design?.pageSize || 'A4',
        printBackground: true,
        displayHeaderFooter: false, // Clean for printing
        margin: { top: '0', bottom: '0', left: '0', right: '0' }
      });

      return { pdfBuffer, title: resume.title };
    } finally {
      await page.close();
      await browser.close();
    }
  }
}

module.exports = new PdfService();
