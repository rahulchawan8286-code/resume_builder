const mongoose = require('mongoose');

const componentScoreSchema = new mongoose.Schema({
  score: { type: Number, default: null }, // Null means unavailable
  available: { type: Boolean, default: false }
}, { _id: false });

const readinessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  overallScore: { type: Number, default: null },
  components: {
    aptitude: { type: componentScoreSchema, default: () => ({}) },
    coreECE: { type: componentScoreSchema, default: () => ({}) },
    coding: { type: componentScoreSchema, default: () => ({}) },
    resume: { type: componentScoreSchema, default: () => ({}) },
    interview: { type: componentScoreSchema, default: () => ({}) },
    companyPreparation: { type: componentScoreSchema, default: () => ({}) }
  },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  recommendations: { type: [String], default: [] },
  lastCalculatedAt: { type: Date, default: null },
  lastAiAnalysisAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Readiness', readinessSchema);
