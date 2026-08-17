const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  fileUrl: { type: String, required: false }, // Cloudinary URL, optional now since we have a builder
  personalInfo: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  },
  summary: { type: String, default: '' },
  education: [{
    institution: String,
    degree: String,
    branch: String,
    startDate: String,
    endDate: String,
    score: String // CGPA/percentage
  }],
  skills: {
    technical: [{ type: String }],
    soft: [{ type: String }],
    tools: [{ type: String }]
  },
  projects: [{
    title: String,
    description: String,
    technologies: String,
    role: String,
    duration: String,
    link: String
  }],
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    link: String
  }],
  achievements: [{ type: String }],
  parsedData: { type: mongoose.Schema.Types.Mixed }, // Legacy parsed JSON data
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'ResumeTemplate', required: false }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
