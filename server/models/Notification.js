const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['system', 'billing', 'feature', 'alert'], default: 'system' },
    readStatus: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: false }
  }
);

// --- Indexes ---
// Quickly find unread notifications for a user
NotificationSchema.index({ user: 1, readStatus: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
