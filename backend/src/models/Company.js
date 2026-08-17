const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  website: { type: String },
  logoUrl: { type: String },
  industry: { type: String },
  openRoles: [{
    title: { type: String },
    description: { type: String },
    requirements: { type: String },
    applyLink: { type: String }
  }],
  eligibility: { type: String },
  requiredSkills: [{ type: String }],
  interviewRounds: [{
    title: { type: String },
    desc: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
