const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  completedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  mcqScores: [{
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
    score: { type: Number },
    total: { type: Number }
  }],
  lastStudiedChapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' }
}, { timestamps: true });

// Ensure one progress document per user per subject
userProgressSchema.index({ user: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
