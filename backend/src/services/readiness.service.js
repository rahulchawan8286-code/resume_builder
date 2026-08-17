const Result = require('../models/Result');
const CodeSubmission = require('../models/CodeSubmission');
const Resume = require('../models/Resume');
const StudyPlan = require('../models/StudyPlan');
const AIHistory = require('../models/AIHistory');
const Readiness = require('../models/Readiness');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Component Weights
const WEIGHTS = {
  aptitude: 0.20,
  coreECE: 0.20,
  coding: 0.20,
  resume: 0.15,
  interview: 0.15,
  companyPreparation: 0.10
};

const calculateDeterministicScore = async (userId) => {
  const components = {
    aptitude: { score: null, available: false },
    coreECE: { score: null, available: false },
    coding: { score: null, available: false },
    resume: { score: null, available: false },
    interview: { score: null, available: false },
    companyPreparation: { score: null, available: false }
  };

  // 1. Aptitude & Core ECE (from Results + Quiz -> Subject)
  const results = await Result.find({ user: userId }).populate({
    path: 'quiz',
    populate: { path: 'subject' }
  });

  const aptitudeScores = [];
  const eceScores = [];

  results.forEach(r => {
    if (r.quiz && r.quiz.subject) {
      const subjectName = r.quiz.subject.name.toLowerCase();
      const pct = (r.score / r.totalQuestions) * 100;
      if (subjectName.includes('aptitude') || subjectName.includes('reasoning') || subjectName.includes('math')) {
        aptitudeScores.push(pct);
      } else {
        eceScores.push(pct);
      }
    }
  });

  if (aptitudeScores.length > 0) {
    components.aptitude.score = aptitudeScores.reduce((a, b) => a + b, 0) / aptitudeScores.length;
    components.aptitude.available = true;
  }
  if (eceScores.length > 0) {
    components.coreECE.score = eceScores.reduce((a, b) => a + b, 0) / eceScores.length;
    components.coreECE.available = true;
  }

  // 2. Coding (from CodeSubmission)
  const submissions = await CodeSubmission.find({ user: userId });
  if (submissions.length > 0) {
    const accepted = submissions.filter(s => s.status === 'Accepted').length;
    components.coding.score = (accepted / submissions.length) * 100;
    components.coding.available = true;
  }

  // 3. Resume
  const resume = await Resume.findOne({ user: userId });
  if (resume) {
    let score = 0;
    const maxScore = 100;
    
    // Evaluate completeness
    if (resume.personalInfo && resume.personalInfo.email) score += 20;
    if (resume.education && resume.education.length > 0) score += 20;
    if (resume.skills && ((resume.skills.technical && resume.skills.technical.length > 0) || (resume.skills.soft && resume.skills.soft.length > 0))) score += 20;
    if (resume.projects && resume.projects.length > 0) score += 20;
    if (resume.experience && resume.experience.length > 0) score += 20; // Experience might be optional but gives bonus/points

    components.resume.score = Math.min(score, maxScore);
    components.resume.available = true;
  }

  // 4. Mock Interview (AIHistory)
  const interviews = await AIHistory.find({ user: userId, type: 'mock_interview' });
  if (interviews.length > 0) {
    // Basic heuristic: length of transcripts or explicit score if stored in response. 
    // For now, assuming if they did an interview, they get a baseline score or parsing response.
    // Since we don't have a rigid interview score parser, we use a placeholder based on activity count (up to 5 = 100%)
    components.interview.score = Math.min((interviews.length / 5) * 100, 100);
    components.interview.available = true;
  }

  // 5. Company Preparation (StudyPlan)
  const plans = await StudyPlan.find({ user: userId });
  if (plans.length > 0) {
    let totalTasks = 0;
    let completedTasks = 0;
    plans.forEach(p => {
      p.tasks.forEach(t => {
        totalTasks++;
        if (t.isCompleted) completedTasks++;
      });
    });
    if (totalTasks > 0) {
      components.companyPreparation.score = (completedTasks / totalTasks) * 100;
      components.companyPreparation.available = true;
    }
  }

  // Calculate Overall Score based on available components
  let totalWeight = 0;
  let weightedSum = 0;

  for (const [key, comp] of Object.entries(components)) {
    if (comp.available && comp.score !== null) {
      totalWeight += WEIGHTS[key];
      weightedSum += (comp.score * WEIGHTS[key]);
    }
  }

  let overallScore = null;
  if (totalWeight > 0) {
    overallScore = Math.round(weightedSum / totalWeight);
  }

  // Update or Create Readiness Document
  let readiness = await Readiness.findOne({ user: userId });
  if (!readiness) {
    readiness = new Readiness({ user: userId });
  }

  readiness.overallScore = overallScore;
  readiness.components = components;
  readiness.lastCalculatedAt = new Date();

  // If no AI analysis exists yet, generate some deterministic basic strengths/weaknesses
  if (readiness.strengths.length === 0 && readiness.weaknesses.length === 0) {
      if (components.aptitude.available && components.aptitude.score > 70) readiness.strengths.push('Strong aptitude skills');
      else if (components.aptitude.available) readiness.weaknesses.push('Needs aptitude practice');
      
      if (components.resume.available && components.resume.score >= 80) readiness.strengths.push('Comprehensive resume structure');
      else readiness.recommendations.push('Add more sections to your resume (Projects, Experience)');
  }

  await readiness.save();
  return readiness;
};

const generateAIAnalysis = async (userId) => {
  const readiness = await Readiness.findOne({ user: userId });
  if (!readiness) throw new Error('Readiness data not found');

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
      // Fallback deterministic analysis if AI is unavailable
      readiness.recommendations = ['Complete more quizzes to improve score', 'Participate in a mock interview'];
      readiness.lastAiAnalysisAt = new Date();
      await readiness.save();
      return readiness;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
  Analyze this student's placement readiness data and provide insights.
  Data: ${JSON.stringify({ overall: readiness.overallScore, components: readiness.components })}
  
  Format strictly as JSON with exactly these keys: "strengths" (array of strings), "weaknesses" (array of strings), "recommendations" (array of actionable strings). Do not include markdown formatting or backticks around the JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    // Clean up potential markdown formatting
    text = text.replace(/```json\\n/g, '').replace(/```\\n/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(text);
    
    if (Array.isArray(parsed.strengths) && Array.isArray(parsed.weaknesses) && Array.isArray(parsed.recommendations)) {
      readiness.strengths = parsed.strengths;
      readiness.weaknesses = parsed.weaknesses;
      readiness.recommendations = parsed.recommendations;
      readiness.lastAiAnalysisAt = new Date();
      await readiness.save();
    }
  } catch (err) {
    console.error('AI Generation Failed, skipping AI updates:', err.message);
  }

  return readiness;
};

module.exports = {
  calculateDeterministicScore,
  generateAIAnalysis
};
