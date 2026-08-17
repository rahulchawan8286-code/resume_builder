const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  expectedTopics: [{ type: String }], // Legacy backward compatibility
  expectedConcepts: [{ type: String }], // New canonical field
  userAnswer: { type: String, default: null },
  score: { type: Number, default: null },
  feedback: { type: String, default: null },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  missingConcepts: [{ type: String }],
  improvementSuggestion: { type: String, default: null },
  evaluationFailed: { type: Boolean, default: false },
  answeredAt: { type: Date, default: null }
});

const interviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetCompany: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  sessionType: { 
    type: String, 
    enum: ['Technical', 'Core ECE', 'Coding', 'HR', 'Company-specific', 'Mixed'], 
    required: true 
  },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  status: { type: String, enum: ['Started', 'Completed'], default: 'Started' },
  
  questions: [interviewQuestionSchema],
  
  overallScore: { type: Number, default: null },
  technicalScore: { type: Number, default: null },
  coreEceScore: { type: Number, default: null },
  codingScore: { type: Number, default: null },
  hrScore: { type: Number, default: null },
  
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  recommendations: [{ type: String }],
  
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
