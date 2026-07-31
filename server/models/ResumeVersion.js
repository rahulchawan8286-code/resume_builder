const mongoose = require('mongoose');

const ResumeVersionSchema = new mongoose.Schema(
  {
    resume: { type: mongoose.Schema.ObjectId, ref: 'Resume', required: true },
    versionNumber: { type: Number, required: true },
    snapshot: { type: mongoose.Schema.Types.Mixed, required: true }, // Complete JSON payload of the resume at this version
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: false } // We don't update snapshots
  }
);

// --- Indexes ---
// Ensure a resume cannot have duplicate version numbers
ResumeVersionSchema.index({ resume: 1, versionNumber: 1 }, { unique: true });

// --- Instance Methods ---
ResumeVersionSchema.methods.restore = async function () {
  const Resume = mongoose.model('Resume');
  const targetResume = await Resume.findById(this.resume);
  
  if (!targetResume) {
    throw new Error('Original resume not found');
  }

  // Restore fields from snapshot
  Object.assign(targetResume, this.snapshot);
  targetResume.currentVersion = this.versionNumber;
  
  return await targetResume.save();
};

module.exports = mongoose.model('ResumeVersion', ResumeVersionSchema);
