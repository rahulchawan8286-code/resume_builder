const Resume = require('../models/Resume');

class ResumeRepository {
  constructor() {
    this.memoryResumes = [];
    this.idCounter = 1;
  }

  _isDev() {
    return process.env.DEVELOPMENT_MODE === 'true';
  }

  async create(data) {
    if (this._isDev()) {
      const resume = {
        ...data,
        _id: `mock-resume-${this.idCounter++}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        currentVersion: 1,
        analytics: { viewCount: 0, downloadCount: 0, shareCount: 0 },
        isDeleted: false,
        save: async function() { this.updatedAt = new Date(); return this; },
        toObject: function() { return { ...this }; },
        softDelete: async function() { this.isDeleted = true; return this; }
      };
      this.memoryResumes.push(resume);
      return resume;
    }
    const resume = new Resume(data);
    return await resume.save();
  }

  async findById(id) {
    if (this._isDev()) {
      const resume = this.memoryResumes.find(r => r._id === id && !r.isDeleted);
      return resume || null;
    }
    return await Resume.findById(id);
  }

  async findByUserId(userId) {
    if (this._isDev()) {
      return this.memoryResumes
        .filter(r => r.user === userId && !r.isDeleted)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    }
    return await Resume.find({ user: userId }).sort({ updatedAt: -1 });
  }

  async update(resume, data) {
    if (this._isDev()) {
      Object.assign(resume, data, { updatedAt: new Date() });
      return resume;
    }
    Object.assign(resume, data);
    return await resume.save();
  }

  async incrementAnalytics(resume, field) {
    if (this._isDev()) {
      resume.analytics[field] += 1;
      return resume;
    }
    resume.analytics[field] += 1;
    return await resume.save({ validateBeforeSave: false });
  }

  async countUserResumes(userId) {
    if (this._isDev()) {
      return this.memoryResumes.filter(r => r.user === userId && !r.isDeleted).length;
    }
    return await Resume.countDocuments({ user: userId, isDeleted: false });
  }
}

module.exports = new ResumeRepository();
