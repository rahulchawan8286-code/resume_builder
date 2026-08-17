const AIHistory = require('../models/AIHistory');
const Readiness = require('../models/Readiness');
const Resume = require('../models/Resume');
const CodeSubmission = require('../models/CodeSubmission');
const Result = require('../models/Result');
const CompanyTarget = require('../models/CompanyTarget');
const crypto = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateDataHash = (data) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

const validateAIResponse = (parsed) => {
  const schema = ['summary', 'strengths', 'weaknesses', 'priorityGaps', 'recommendations', 'companyInsights', 'studyPlan', 'resumeSuggestions'];
  
  for (let key of schema) {
    if (!parsed[key]) return false;
  }
  
  if (!Array.isArray(parsed.strengths) || !Array.isArray(parsed.weaknesses) || !Array.isArray(parsed.priorityGaps) || !Array.isArray(parsed.recommendations)) {
    return false;
  }
  
  return true;
};

exports.getCareerInsights = async (userId, forceRefresh = false) => {
  // 1. Gather all deterministic data
  const readiness = await Readiness.findOne({ user: userId });
  const resume = await Resume.findOne({ user: userId });
  const codingSubs = await CodeSubmission.find({ user: userId });
  const quizResults = await Result.find({ user: userId }).populate('quiz');
  const targets = await CompanyTarget.find({ user: userId }).populate('company');

  const hasData = readiness || resume || codingSubs.length > 0 || quizResults.length > 0 || targets.length > 0;
  
  if (!hasData) {
    return {
      emptyState: true,
      message: 'Complete some assessments and build your resume to unlock personalized AI career insights.'
    };
  }

  // 2. Build the aggregation payload (snapshot)
  const dataSnapshot = {
    readiness: readiness ? {
      overallScore: readiness.overallScore,
      components: readiness.components
    } : null,
    coding: {
      total: codingSubs.length,
      accepted: codingSubs.filter(c => c.status === 'Accepted').length
    },
    quizzes: quizResults.map(r => ({ score: r.score, total: r.totalQuestions })),
    resumeStats: resume ? {
      hasEmail: !!resume.personalInfo?.email,
      skillsCount: (resume.skills?.technical?.length || 0) + (resume.skills?.soft?.length || 0)
    } : null,
    targets: targets.map(t => ({ name: t.company?.name, status: t.status }))
  };

  const currentDataHash = generateDataHash(dataSnapshot);

  // 3. Cache Check
  if (!forceRefresh) {
    const cachedAnalysis = await AIHistory.findOne({ user: userId, type: 'careerAnalysis' }).sort({ createdAt: -1 });
    if (cachedAnalysis && cachedAnalysis.dataHash === currentDataHash) {
      try {
        const parsedResponse = JSON.parse(cachedAnalysis.response);
        return {
          emptyState: false,
          cached: true,
          data: parsedResponse,
          lastAnalyzedAt: cachedAnalysis.createdAt
        };
      } catch (e) {
        // Fallthrough to regenerate if JSON parsing fails on cache
        console.error("Cached AI response was invalid JSON", e);
      }
    }
  }

  // 4. Check if AI Provider is configured
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
     throw new Error("AI provider unavailable.");
  }

  // 5. Generate with Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const systemInstructions = `
    You are an expert career and placement coach for an engineering student.
    You will analyze their deterministic performance data and output a strict JSON structure.
    Do NOT invent or hallucinate any numerical scores. Use only the provided data to draw conclusions.
    Provide actionable, prioritized recommendations. Keep responses concise.

    The required JSON output schema must exactly match this structure:
    {
      "summary": "String (1-2 sentences)",
      "strengths": ["String", "String"],
      "weaknesses": ["String", "String"],
      "priorityGaps": ["String", "String"],
      "recommendations": ["String", "String"],
      "companyInsights": ["String (pertaining to their target companies)"],
      "studyPlan": ["String (specific topics to study)"],
      "resumeSuggestions": ["String (resume improvement ideas)"]
    }
  `;

  const prompt = `
    System Instructions:
    ${systemInstructions}

    Student Data Context:
    ${JSON.stringify(dataSnapshot)}
    
    Output strictly as JSON. No markdown, no backticks.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\\n/g, '').replace(/```\\n/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);

    if (!validateAIResponse(parsed)) {
      throw new Error("AI returned malformed or incomplete JSON schema.");
    }

    // 6. Save to AIHistory Cache
    const newHistory = new AIHistory({
      user: userId,
      type: 'careerAnalysis',
      prompt: "Aggregated Career Analysis Prompt",
      response: JSON.stringify(parsed),
      dataHash: currentDataHash
    });
    await newHistory.save();

    return {
      emptyState: false,
      cached: false,
      data: parsed,
      lastAnalyzedAt: newHistory.createdAt
    };

  } catch (err) {
    console.error('AI Career Intelligence Generation Failed:', err.message);
    throw new Error("AI analysis is temporarily unavailable. Please try again later.");
  }
};
