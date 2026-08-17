const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Markdown format
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String }],
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
  }],
  starterCode: {
    javascript: { type: String },
    python: { type: String },
    java: { type: String },
    cpp: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
