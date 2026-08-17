const mongoose = require('mongoose');

const resumeTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  previewUrl: { type: String },
  htmlContent: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ResumeTemplate', resumeTemplateSchema);
