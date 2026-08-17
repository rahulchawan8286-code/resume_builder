const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], required: true },
  estimatedMinutes: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
}, { _id: true }); // Need _id to reference individual tasks

const weekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  tasks: [taskSchema]
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], required: true },
  reason: { type: String, required: true }
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetCompany: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  title: { type: String, default: 'Personalized Placement Roadmap' },
  description: { type: String, default: 'A step-by-step guide to achieving placement readiness.' },
  overallProgress: { type: Number, default: 0 },
  status: { type: String, enum: ['Generated', 'In Progress', 'Completed'], default: 'Generated' },
  skillGaps: [skillGapSchema],
  weeks: [weekSchema],
  lastGeneratedAt: { type: Date, default: Date.now },
  lastAiPersonalizedAt: { type: Date, default: null }
}, { timestamps: true });

// A user should have at most one active roadmap per target company.
// Null targetCompany is allowed for a generic roadmap, but index might complain if multiple nulls exist, 
// so partialFilterExpression is used to only enforce uniqueness when targetCompany exists.
roadmapSchema.index({ user: 1, targetCompany: 1 }, { unique: true, partialFilterExpression: { targetCompany: { $exists: true, $ne: null } } });

module.exports = mongoose.model('Roadmap', roadmapSchema);
