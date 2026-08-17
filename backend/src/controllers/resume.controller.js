const Resume = require('../models/Resume');
const ResumeTemplate = require('../models/ResumeTemplate');
const ATSReport = require('../models/ATSReport');
const { successResponse, errorResponse } = require('../utils/responseFormat');
const { calculateDeterministicScore } = require('../services/readiness.service');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ updatedAt: -1 });
    return successResponse(res, 200, 'Resumes retrieved', resumes);
  } catch (error) {
    next(error);
  }
};

exports.getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id }).populate('template');
    if (!resume) return errorResponse(res, 404, 'Resume not found');
    return successResponse(res, 200, 'Resume retrieved', resume);
  } catch (error) {
    next(error);
  }
};

exports.createResume = async (req, res, next) => {
  try {
    const newResume = new Resume({ ...req.body, user: req.user.id });
    await newResume.save();
    return successResponse(res, 201, 'Resume created', newResume);
  } catch (error) {
    next(error);
  }
};

exports.updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!resume) return errorResponse(res, 404, 'Resume not found');
    
    // Auto update readiness if it's updated (so progress reflects without ATS scan sometimes, but ATS scan is the main trigger)
    calculateDeterministicScore(req.user.id).catch(err => console.error(err));

    return successResponse(res, 200, 'Resume updated', resume);
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!resume) return errorResponse(res, 404, 'Resume not found');
    return successResponse(res, 200, 'Resume deleted');
  } catch (error) {
    next(error);
  }
};

exports.duplicateResume = async (req, res, next) => {
  try {
    const original = await Resume.findOne({ _id: req.params.id, user: req.user.id }).lean();
    if (!original) return errorResponse(res, 404, 'Resume not found');

    delete original._id;
    delete original.createdAt;
    delete original.updatedAt;
    delete original.__v;
    original.title = `${original.title} (Copy)`;

    const duplicate = new Resume(original);
    await duplicate.save();
    return successResponse(res, 201, 'Resume duplicated', duplicate);
  } catch (error) {
    next(error);
  }
};

exports.getTemplates = async (req, res, next) => {
  try {
    const templates = await ResumeTemplate.find({ isActive: true });
    return successResponse(res, 200, 'Templates retrieved', templates);
  } catch (error) {
    next(error);
  }
};

exports.getATSReport = async (req, res, next) => {
  try {
    const report = await ATSReport.findOne({ resume: req.params.id, user: req.user.id }).sort({ createdAt: -1 });
    if (!report) return errorResponse(res, 404, 'No ATS report found for this resume');
    return successResponse(res, 200, 'ATS Report retrieved', report);
  } catch (error) {
    next(error);
  }
};

exports.analyzeATS = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return errorResponse(res, 404, 'Resume not found');

    const targetRole = req.body.targetRole || 'Software Engineer'; // Default if not provided

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
      return errorResponse(res, 500, 'AI Service is currently unavailable. Check GEMINI_API_KEY.');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Act as an expert ATS (Applicant Tracking System) scanner. Analyze the following resume for the target role of "${targetRole}".
      
      Resume Data:
      ${JSON.stringify({
        summary: resume.summary,
        skills: resume.skills,
        experience: resume.experience,
        projects: resume.projects,
        education: resume.education
      })}

      Return a JSON response with exactly this structure, no markdown:
      {
        "score": (number 0-100),
        "feedback": (string, detailed suggestions for improvement),
        "keywordMatches": [ (array of strings, matching keywords found) ],
        "missingKeywords": [ (array of strings, important keywords missing) ]
      }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(text);

    const report = new ATSReport({
      user: req.user.id,
      resume: resume._id,
      targetRole,
      score: parsed.score,
      feedback: parsed.feedback,
      keywordMatches: parsed.keywordMatches,
      missingKeywords: parsed.missingKeywords
    });

    await report.save();

    // Trigger Readiness Update
    calculateDeterministicScore(req.user.id).catch(err => console.error('Readiness error:', err));

    return successResponse(res, 201, 'ATS Analysis complete', report);
  } catch (error) {
    console.error('ATS Analysis Error:', error);
    next(error);
  }
};
