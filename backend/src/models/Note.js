const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  chapterNumber: { type: Number, required: true },
  shortDescription: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  examImportance: { type: String, enum: ['Low', 'Medium', 'High'], default: 'High' },
  
  content: { type: String, required: true }, // Legacy/main markdown
  
  topics: [{ type: String }],
  importantConcepts: [{ type: String }],
  formulas: [{ type: String }],
  examples: [{ type: String }],
  
  questions2Mark: [{ type: String }],
  questions5Mark: [{ type: String }],
  questions10Mark: [{ type: String }],
  
  quickRevision: [{ type: String }],
  
  mcqs: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String }
  }],
  
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [{ type: String }],
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index for idempotency
noteSchema.index({ subject: 1, chapterNumber: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);
