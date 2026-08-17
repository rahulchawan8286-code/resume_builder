const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetDate: { type: Date },
  tasks: [{
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    type: { type: String, enum: ['quiz', 'reading', 'coding', 'general'] },
    referenceId: { type: mongoose.Schema.Types.ObjectId } // Refers to a specific quiz, note, etc.
  }]
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
