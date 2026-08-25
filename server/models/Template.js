const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    thumbnail: { type: String, required: true }, // Cloudinary URL
    isPremium: { type: Boolean, default: false },
    category: { type: String, enum: ['modern', 'classic', 'creative', 'ats-optimized'], required: true },
    
    // Style configurations
    primaryColor: { type: String, default: '#000000' },
    secondaryColor: { type: String, default: '#666666' },
    fonts: { type: Map, of: String }, // e.g. { heading: 'Inter', body: 'Roboto' }
    layout: { type: String, enum: ['single-column', 'two-column', 'timeline'], default: 'single-column' },
    
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

// --- Indexes ---
TemplateSchema.index({ category: 1, isActive: 1 });

// --- Pre-Find Hooks ---
TemplateSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model('Template', TemplateSchema);
