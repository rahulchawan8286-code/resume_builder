const Readiness = require('../models/Readiness');
const Roadmap = require('../models/Roadmap');
const InterviewSession = require('../models/InterviewSession');
const CodeSubmission = require('../models/CodeSubmission');
const Result = require('../models/Result');
const Resume = require('../models/Resume');
const Company = require('../models/Company');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.getAnalyticsOverview = async (userId) => {
  const readiness = await Readiness.findOne({ user: userId });
  const roadmap = await Roadmap.findOne({ user: userId }).populate('targetCompany');
  const interviews = await InterviewSession.find({ user: userId, status: 'Completed' }).sort({ completedAt: -1 });
  const codeSubs = await CodeSubmission.find({ user: userId });
  const results = await Result.find({ user: userId }).populate('quiz');
  const resume = await Resume.findOne({ user: userId });

  // 1. Readiness
  const overallReadiness = readiness?.overallScore || null;
  const readinessTrend = readiness ? [{ score: overallReadiness, date: readiness.lastCalculatedAt }] : [];

  // 2. Component Performance
  const componentPerformance = {
    Aptitude: readiness?.components?.aptitude?.score || null,
    CoreECE: readiness?.components?.coreECE?.score || null,
    Coding: readiness?.components?.coding?.score || null,
    Resume: readiness?.components?.resume?.score || null,
    Interview: readiness?.components?.interview?.score || null,
    CompanyPrep: readiness?.components?.companyPreparation?.score || null
  };

  // 3. Roadmap
  const roadmapAnalytics = {
    progress: roadmap?.overallProgress || 0,
    total: 0,
    completed: 0,
    remaining: 0
  };
  
  if (roadmap) {
    roadmap.weeks.forEach(w => {
      w.tasks.forEach(t => {
        roadmapAnalytics.total++;
        if (t.isCompleted) roadmapAnalytics.completed++;
      });
    });
    roadmapAnalytics.remaining = roadmapAnalytics.total - roadmapAnalytics.completed;
    // Mathematically enforce progress
    roadmapAnalytics.progress = roadmapAnalytics.total > 0 ? Math.round((roadmapAnalytics.completed / roadmapAnalytics.total) * 100) : 0;
  }

  // 4. Interviews
  const interviewAnalytics = {
    count: interviews.length,
    average: interviews.length ? Math.round(interviews.reduce((a, b) => a + (b.overallScore || 0), 0) / interviews.length) : null,
    latest: interviews.length > 0 ? interviews[0].overallScore : null,
    best: interviews.length > 0 ? Math.max(...interviews.map(i => i.overallScore || 0)) : null,
    breakdown: interviews.length > 0 ? {
      Technical: interviews[0].technicalScore,
      CoreECE: interviews[0].coreEceScore,
      Coding: interviews[0].codingScore,
      HR: interviews[0].hrScore
    } : null
  };

  // 5. Coding
  const codingAnalytics = {
    total: codeSubs.length,
    accepted: codeSubs.filter(c => c.status === 'Accepted').length,
    acceptanceRate: codeSubs.length ? Math.round((codeSubs.filter(c => c.status === 'Accepted').length / codeSubs.length) * 100) : 0
  };

  // 6. Academics (Aptitude & Core ECE)
  // Assuming quizzes are either 'Aptitude' or 'Core ECE' via category. We'll separate safely.
  const academicAnalytics = {
    totalAttempts: results.length,
    averageScore: results.length ? Math.round(results.reduce((a, b) => a + ((b.score/b.totalQuestions)*100), 0) / results.length) : null,
  };

  // 7. Resume
  const resumeAnalytics = {
    score: readiness?.components?.resume?.score || null,
    skillsCount: resume ? (resume.skills?.technical?.length || 0) + (resume.skills?.soft?.length || 0) : 0,
    projectsCount: resume?.projects?.length || 0,
    experienceCount: resume?.experience?.length || 0,
    hasEducation: !!(resume?.education && resume.education.length > 0)
  };

  // 8. Company Prep
  const companyAnalytics = {
    target: roadmap?.targetCompany?.name || null,
    preparationScore: componentPerformance.CompanyPrep,
  };

  // 9. Persistent Weaknesses (Deterministic logic)
  const weakAreasFreq = {};
  if (readiness?.weaknesses) {
    readiness.weaknesses.forEach(w => { weakAreasFreq[w] = (weakAreasFreq[w] || 0) + 1; });
  }
  if (roadmap?.skillGaps) {
    roadmap.skillGaps.forEach(g => {
      if (['Critical', 'High'].includes(g.priority)) {
        weakAreasFreq[g.skill] = (weakAreasFreq[g.skill] || 0) + 1;
      }
    });
  }
  interviews.forEach(i => {
    if (i.weaknesses) {
      i.weaknesses.forEach(w => {
         // w is string like "Core ECE Concepts (Score: 40)"
         const clean = w.split(' (')[0];
         weakAreasFreq[clean] = (weakAreasFreq[clean] || 0) + 1;
      });
    }
  });

  const persistentWeaknesses = Object.keys(weakAreasFreq)
    .filter(k => weakAreasFreq[k] >= 2)
    .map(k => ({ area: k, frequency: weakAreasFreq[k] }))
    .sort((a,b) => b.frequency - a.frequency);

  // Deterministic Insight Fallback
  let deterministicInsight = "Complete more assessments to generate insights.";
  if (persistentWeaknesses.length > 0) {
    deterministicInsight = `Your most persistent weakness is ${persistentWeaknesses[0].area}. Focus your efforts here.`;
  } else if (roadmapAnalytics.progress > 0) {
    deterministicInsight = `You have completed ${roadmapAnalytics.completed} tasks. Keep up the good work!`;
  } else if (overallReadiness) {
    deterministicInsight = `Your current readiness is ${overallReadiness}%. Work on your roadmap to improve.`;
  }

  return {
    readiness: {
      score: overallReadiness,
      trend: readinessTrend
    },
    components: componentPerformance,
    roadmap: roadmapAnalytics,
    skillGaps: roadmap?.skillGaps || [],
    interviews: interviewAnalytics,
    coding: codingAnalytics,
    academics: academicAnalytics,
    resume: resumeAnalytics,
    company: companyAnalytics,
    persistentWeaknesses,
    deterministicInsight
  };
};

exports.generateAiInsight = async (userId) => {
  const data = await this.getAnalyticsOverview(userId);
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
     return { insight: data.deterministicInsight };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Strip sensitive/unnecessary data
    const payload = {
       readiness: data.readiness.score,
       components: data.components,
       roadmapProgress: data.roadmap.progress,
       persistentWeaknesses: data.persistentWeaknesses.map(w => w.area)
    };

    const prompt = `
      You are an AI career coach for an engineering student.
      Analyze this placement progress data:
      ${JSON.stringify(payload)}
      
      Write a highly concise, personalized 2-sentence weekly insight.
      Do not use markdown or quotes. Be encouraging but direct about what to focus on next.
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    return { insight: text };
  } catch (err) {
    console.error('AI Insight Generation Failed:', err.message);
    return { insight: data.deterministicInsight };
  }
};
