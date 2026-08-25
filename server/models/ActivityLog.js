const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g. 'LOGIN', 'DOWNLOAD_PDF', 'UPDATE_RESUME'
    ipAddress: { type: String },
    browser: { type: String },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false }
  }
);

// --- Indexes ---
// Fetch recent activity logs for a specific user
ActivityLogSchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
