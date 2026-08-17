const mongoose = require('mongoose');

const atsReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  targetRole: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: String, required: true }, // General AI feedback
  keywordMatches: [{ type: String }],
  missingKeywords: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('ATSReport', atsReportSchema);
