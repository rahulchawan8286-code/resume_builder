const { z } = require('zod');

exports.generatePdfSchema = {
  body: z.object({
    resumeId: z.string().min(1, 'Resume ID is required')
  })
};

exports.printPdfSchema = {
  body: z.object({
    resumeId: z.string().min(1, 'Resume ID is required')
  })
};
