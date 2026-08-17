const mongoose = require('mongoose');

const codeSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Error'], default: 'Pending' },
  executionTime: { type: Number },
  memoryUsed: { type: Number },
  failedTestCase: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('CodeSubmission', codeSubmissionSchema);
