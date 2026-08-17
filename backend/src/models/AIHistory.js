const mongoose = require('mongoose');

const aiHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  type: { type: String, enum: ['mockInterview', 'resumeReview', 'codeHelper', 'general', 'careerAnalysis'], required: true },
  context: { type: mongoose.Schema.Types.Mixed }, // Additional data like the specific code or resume content
  dataHash: { type: String } // Used for cache invalidation
}, { timestamps: true });

module.exports = mongoose.model('AIHistory', aiHistorySchema);
