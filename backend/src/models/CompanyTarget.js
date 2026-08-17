const mongoose = require('mongoose');

const companyTargetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status: { 
    type: String, 
    enum: ['Interested', 'Preparing', 'Ready', 'Applied'], 
    default: 'Interested' 
  }
}, { timestamps: true });

companyTargetSchema.index({ user: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('CompanyTarget', companyTargetSchema);
