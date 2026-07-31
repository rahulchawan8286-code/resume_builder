const ResumeVersion = require('../models/ResumeVersion');

class ResumeVersionRepository {
  constructor() {
    this.memoryVersions = [];
  }

  _isDev() {
    return process.env.DEVELOPMENT_MODE === 'true';
  }

  async createSnapshot(resumeId, versionNumber, snapshotData) {
    if (this._isDev()) {
      const version = {
        _id: `mock-version-${Date.now()}`,
        resume: resumeId,
        versionNumber,
        snapshot: snapshotData,
        createdDate: new Date()
      };
      this.memoryVersions.push(version);
      return version;
    }
    const version = new ResumeVersion({
      resume: resumeId,
      versionNumber,
      snapshot: snapshotData
    });
    return await version.save();
  }

  async findVersionsByResumeId(resumeId) {
    if (this._isDev()) {
      return this.memoryVersions
        .filter(v => v.resume === resumeId)
        .sort((a, b) => b.versionNumber - a.versionNumber)
        .map(v => ({ _id: v._id, versionNumber: v.versionNumber, createdDate: v.createdDate }));
    }
    return await ResumeVersion.find({ resume: resumeId })
      .sort({ versionNumber: -1 })
      .select('versionNumber createdDate');
  }

  async findByVersionNumber(resumeId, versionNumber) {
    if (this._isDev()) {
      return this.memoryVersions.find(v => v.resume === resumeId && v.versionNumber === versionNumber) || null;
    }
    return await ResumeVersion.findOne({ resume: resumeId, versionNumber });
  }
}

module.exports = new ResumeVersionRepository();
