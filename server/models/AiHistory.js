const mongoose = require('mongoose');

const AiHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    resume: { type: mongoose.Schema.ObjectId, ref: 'Resume', index: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    model: { type: String, required: true }, // e.g., 'gpt-4', 'gpt-3.5-turbo'
    tokensUsed: { type: Number, default: 0 }
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: false }
  }
);

// --- Indexes ---
// Efficiently query a user's recent AI requests
AiHistorySchema.index({ user: 1, createdDate: -1 });

module.exports = mongoose.model('AiHistory', AiHistorySchema);
