const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, unique: true },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    language: { type: String, default: 'en' },
    emailNotifications: {
      marketing: { type: Boolean, default: false },
      productUpdates: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true }
    },
    aiPreferences: {
      autoSuggest: { type: Boolean, default: true },
      grammarCheck: { type: Boolean, default: true }
    },
    privacySettings: {
      profileVisibleToEmployers: { type: Boolean, default: false },
      allowDataAnalytics: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Settings', SettingsSchema);
