const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String }
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  grade: { type: String },
  startYear: { type: String },
  endYear: { type: String },
  location: { type: String }
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  liveUrl: { type: String },
  githubUrl: { type: String },
  techStack: { type: String },
  description: { type: String }
});

const InternshipSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String
});

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Resume title is required'], trim: true },
    
    // Status & Visibility
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    resumeVisibility: { type: String, enum: ['private', 'public', 'link'], default: 'private' },
    isFavorite: { type: Boolean, default: false },

    // Data Sections
    personalInfo: {
      firstName: String, lastName: String, email: String, phone: String,
      location: String, website: String, linkedin: String, github: String, profilePhoto: String
    },
    objective: { type: String, maxlength: 1500 },
    education: [EducationSchema],
    projects: [ProjectSchema],
    experience: [ExperienceSchema],
    internships: [InternshipSchema],
    
    skills: [{ type: String }], // Legacy / general
    technicalSkills: [{ type: String }],
    softSkills: [{ type: String }],
    
    languages: [{ language: String, proficiency: { type: String, enum: ['Basic', 'Conversational', 'Fluent', 'Native'] } }],
    achievements: [{ type: String }],
    certificates: [{ name: String, issuer: String, issueDate: String, link: String }],
    hobbies: [{ type: String }],
    references: [{ name: String, position: String, company: String, email: String, phone: String }],
    customSections: [{ title: String, content: String }],
    
    qrCode: { type: String }, // URL to generated QR code
    
    // Theme & Styling Config
    design: {
      templateId: { type: mongoose.Schema.ObjectId, ref: 'Template' },
      theme: { type: String, default: 'default' },
      primaryColor: { type: String, default: '#000000' },
      secondaryColor: { type: String, default: '#666666' },
      fonts: { heading: String, body: String },
      layout: { type: String, default: 'single-column' },
      margins: { type: String, default: 'normal' },
      pageSize: { type: String, enum: ['A4', 'Letter'], default: 'A4' },
      spacing: { type: String, default: 'normal' },
      profilePhotoPosition: { type: String, enum: ['left', 'right', 'center', 'hidden'], default: 'hidden' }
    },
    
    // Analytics & Metrics
    atsScore: { type: Number, min: 0, max: 100, default: 0 },
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
    missingFields: [{ type: String }],
    suggestions: [{ type: String }],
    
    analytics: {
      downloadCount: { type: Number, default: 0 },
      viewCount: { type: Number, default: 0 },
      shareCount: { type: Number, default: 0 }
    },
    
    currentVersion: { type: Number, default: 1 },
    
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    
    // Soft Delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// --- Indexes ---
ResumeSchema.index({ user: 1, isDeleted: 1 });
ResumeSchema.index({ 'experience.description': 'text', 'projects.description': 'text', 'technicalSkills': 'text' });

// --- Pre-Find Hooks ---
ResumeSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// --- Methods ---
ResumeSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

module.exports = mongoose.model('Resume', ResumeSchema);
