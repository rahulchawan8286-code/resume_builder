const resumeRepository = require('../repositories/resumeRepository');
const resumeVersionRepository = require('../repositories/resumeVersionRepository');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

class ResumeService {
  
  // Calculate completion percentage internally
  _calculateCompletion(resumeData) {
    let score = 0;
    const missingFields = [];
    
    if (resumeData.personalInfo?.firstName) score += 10; else missingFields.push('First Name');
    if (resumeData.personalInfo?.email) score += 10; else missingFields.push('Email');
    if (resumeData.education && resumeData.education.length > 0) score += 20; else missingFields.push('Education');
    if (resumeData.experience && resumeData.experience.length > 0) score += 20; else missingFields.push('Experience');
    if (resumeData.projects && resumeData.projects.length > 0) score += 15; else missingFields.push('Projects');
    if (resumeData.technicalSkills && resumeData.technicalSkills.length > 0) score += 15; else missingFields.push('Technical Skills');
    if (resumeData.summary) score += 10; else missingFields.push('Summary');
    
    return { score, missingFields };
  }

  async createResume(userId, data) {
    // Check max limits (e.g., config for 10 resumes max)
    const count = await resumeRepository.countUserResumes(userId);
    if (count >= 10) {
      throw new ErrorResponse('Maximum limit of 10 resumes reached. Please delete an old resume.', 403);
    }

    const { score, missingFields } = this._calculateCompletion(data);
    
    const resumeData = {
      ...data,
      user: userId,
      createdBy: userId,
      updatedBy: userId,
      completionPercentage: score,
      missingFields
    };

    const resume = await resumeRepository.create(resumeData);
    logger.info(`Resume created: ${resume._id} by user: ${userId}`);
    return resume;
  }

  async getResumeById(resumeId, userId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    
    // Auth Check: Owner only, unless it's public (for view mode, skipped here for simplicity)
    if (resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to access this resume', 403);
    }
    
    // Increment analytics
    await resumeRepository.incrementAnalytics(resume, 'viewCount');
    return resume;
  }

  async getUserResumes(userId) {
    return await resumeRepository.findByUserId(userId);
  }

  async updateResume(resumeId, userId, data) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    if (resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to update this resume', 403);
    }

    const { score, missingFields } = this._calculateCompletion({...resume.toObject(), ...data});
    
    data.completionPercentage = score;
    data.missingFields = missingFields;
    data.updatedBy = userId;

    const updated = await resumeRepository.update(resume, data);
    logger.info(`Resume updated: ${resumeId}`);
    return updated;
  }

  async deleteResume(resumeId, userId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    if (resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    await resume.softDelete();
    logger.info(`Resume soft-deleted: ${resumeId}`);
    return true;
  }

  async duplicateResume(resumeId, userId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    if (resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    const count = await resumeRepository.countUserResumes(userId);
    if (count >= 10) throw new ErrorResponse('Maximum limit reached', 403);

    const duplicateData = resume.toObject();
    delete duplicateData._id;
    delete duplicateData.id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    
    duplicateData.title = `${duplicateData.title} (Copy)`;
    duplicateData.status = 'draft';
    duplicateData.currentVersion = 1;
    duplicateData.analytics = { downloadCount: 0, viewCount: 0, shareCount: 0 };

    const duplicate = await resumeRepository.create(duplicateData);
    logger.info(`Resume duplicated: ${resumeId} -> ${duplicate._id}`);
    return duplicate;
  }

  async changeStatus(resumeId, userId, newStatus) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    if (resume.user.toString() !== userId.toString()) throw new ErrorResponse('Not authorized', 403);
    
    resume.status = newStatus;
    await resume.save();
    return resume;
  }

  // Version Control
  async saveVersion(resumeId, userId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new ErrorResponse('Resume not found', 404);
    if (resume.user.toString() !== userId.toString()) throw new ErrorResponse('Not authorized', 403);

    // Increment version in main doc
    resume.currentVersion += 1;
    await resume.save();

    // Take snapshot payload
    const snapshot = resume.toObject();
    delete snapshot._id;
    delete snapshot.id;

    const version = await resumeVersionRepository.createSnapshot(resume._id, resume.currentVersion, snapshot);
    logger.info(`Version ${resume.currentVersion} saved for Resume: ${resumeId}`);
    return version;
  }

  async getVersionHistory(resumeId, userId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume || resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized or found', 403);
    }
    return await resumeVersionRepository.findVersionsByResumeId(resumeId);
  }

  async restoreVersion(resumeId, versionNumber, userId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume || resume.user.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized or found', 403);
    }

    const version = await resumeVersionRepository.findByVersionNumber(resumeId, versionNumber);
    if (!version) throw new ErrorResponse('Version not found', 404);

    const restoredResume = await version.restore();
    logger.info(`Resume ${resumeId} restored to version ${versionNumber}`);
    return restoredResume;
  }
}

module.exports = new ResumeService();
