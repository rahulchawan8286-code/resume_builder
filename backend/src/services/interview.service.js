const InterviewSession = require('../models/InterviewSession');
const Resume = require('../models/Resume');
const Roadmap = require('../models/Roadmap');
const Company = require('../models/Company');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const readinessService = require('./readiness.service'); // for triggering readiness recalcs

// Helper to determine base questions
const getDeterministicQuestions = (sessionType, difficulty, context) => {
  const questions = [];
  const addQ = (q, c, expected) => questions.push({ question: q, category: c, difficulty, expectedConcepts: expected });

  // Use student context to pick questions
  const hasCPP = context.skills.includes('c++');
  const hasDSA = context.skills.includes('data structures') || context.skills.includes('dsa');
  const hasEmbedded = context.skills.includes('embedded c') || context.skills.includes('microcontrollers');

  if (sessionType === 'Technical' || sessionType === 'Mixed' || sessionType === 'Coding') {
    if (hasCPP) addQ('Explain the concept of Virtual Functions in C++ and how they enable runtime polymorphism.', 'Coding', ['Polymorphism', 'Virtual Table', 'Override']);
    else addQ('What are the key differences between a compiled language and an interpreted language?', 'Coding', ['Compiler', 'Interpreter', 'Execution Speed']);
    
    if (hasDSA) addQ('Explain how a hash table works and what a collision is.', 'Coding', ['Hash Function', 'Buckets', 'Chaining', 'Linear Probing']);
    else addQ('What is an array and how is it stored in memory?', 'Coding', ['Contiguous memory', 'Indices', 'Fixed size']);
  }

  if (sessionType === 'Technical' || sessionType === 'Mixed' || sessionType === 'Core ECE') {
    if (hasEmbedded) addQ('What is the difference between a microcontroller and a microprocessor?', 'Core ECE', ['Memory', 'Peripherals', 'Application']);
    addQ('Explain the working principle of a multiplexer (MUX).', 'Core ECE', ['Data Selector', 'Select Lines', '2^n inputs to 1 output']);
    addQ('What are setup time and hold time in digital circuits?', 'Core ECE', ['Clock Edge', 'Data Stability', 'Flip-flop']);
  }

  if (sessionType === 'HR' || sessionType === 'Mixed' || sessionType === 'Company-specific') {
    addQ('Tell me about a time you faced a difficult challenge in a project and how you overcame it.', 'HR', ['Problem Solving', 'Resilience', 'Action Taken']);
    addQ('Why do you want to join our company?', 'HR', ['Company Knowledge', 'Alignment with goals', 'Growth']);
  }

  if (questions.length === 0) {
     addQ('What is your strongest technical skill and why?', 'Technical', ['Self-awareness', 'Technical depth']);
  }

  return questions.slice(0, 5);
};

exports.generateQuestions = async (userId, targetCompanyId, sessionType, difficulty) => {
  const resume = await Resume.findOne({ user: userId });
  const roadmap = await Roadmap.findOne({ user: userId });
  const company = targetCompanyId ? await Company.findById(targetCompanyId) : null;
  
  const context = {
    skills: [],
    weaknesses: [],
    projects: []
  };

  if (resume && resume.skills && resume.skills.technical) {
    context.skills = resume.skills.technical.map(s => s.toLowerCase());
  }
  if (resume && resume.projects) {
    context.projects = resume.projects.map(p => p.name);
  }
  if (roadmap && roadmap.skillGaps) {
    context.weaknesses = roadmap.skillGaps.map(g => g.skill);
  }

  let questions = [];

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key') {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an expert technical interviewer for Electronics and Communication Engineering (ECE) and Software roles.
        Generate exactly 5 interview questions for a candidate.
        Session Type: ${sessionType}
        Difficulty: ${difficulty}
        Candidate Skills: ${context.skills.join(', ')}
        Candidate Projects: ${context.projects.join(', ')}
        Target Company: ${company ? company.name : 'General Tech'}
        ${company ? 'Required Company Skills: ' + (company.requiredSkills || []).join(', ') : ''}
        
        Return ONLY a JSON array of objects with exactly this format:
        [
          {
            "question": "The question text",
            "category": "One of: Technical, Core ECE, Coding, HR",
            "difficulty": "${difficulty}",
            "expectedConcepts": ["concept1", "concept2"]
          }
        ]
      `;
      const result = await model.generateContent(prompt);
      let text = result.response.text().replace(/```json\\n/g, '').replace(/```\\n/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
         questions = parsed.filter(q => q.question && q.expectedConcepts).map(q => ({
           question: q.question,
           category: q.category || sessionType,
           difficulty: q.difficulty || difficulty,
           expectedConcepts: Array.isArray(q.expectedConcepts) ? q.expectedConcepts : []
         }));
      }
    } catch (err) {
      console.error('AI Question Generation Failed:', err.message);
    }
  }

  if (questions.length === 0) {
    questions = getDeterministicQuestions(sessionType, difficulty, context);
  }

  return questions;
};

exports.evaluateAnswer = async (questionData, userAnswer) => {
  // If no AI available, we MUST NOT fabricate a fake score according to Phase 9 rules.
  // We will throw an error to force a failure state, allowing a retry.
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
     throw new Error("AI provider unavailable for evaluation.");
  }

  const expectedConcepts = questionData.expectedConcepts && questionData.expectedConcepts.length > 0 
    ? questionData.expectedConcepts 
    : questionData.expectedTopics; // Fallback to legacy if needed

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `
    Evaluate this interview answer.
    Question: "${questionData.question}"
    Expected Concepts: ${expectedConcepts.join(', ')}
    User Answer: "${userAnswer}"
    
    Return ONLY a JSON object strictly following this schema:
    {
      "score": <number 0-100, representing Technical Correctness, Completeness, Clarity>,
      "strengths": ["string"],
      "weaknesses": ["string"],
      "missingConcepts": ["string"],
      "feedback": "string (Short actionable feedback)",
      "improvementSuggestion": "string (Specific suggestion for improvement)"
    }
  `;

  const result = await model.generateContent(prompt);
  let text = result.response.text().replace(/```json\\n/g, '').replace(/```\\n/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(text);

  // Validate strict schema
  const requiredFields = ['score', 'strengths', 'weaknesses', 'missingConcepts', 'feedback', 'improvementSuggestion'];
  for (const field of requiredFields) {
    if (parsed[field] === undefined) {
      throw new Error("Malformed AI response format");
    }
  }

  // Normalize score
  let score = Number(parsed.score);
  if (isNaN(score)) score = 0;
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return { 
    score: Math.round(score),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
    feedback: String(parsed.feedback),
    improvementSuggestion: String(parsed.improvementSuggestion)
  };
};

exports.finishSession = async (sessionId, userId) => {
  const session = await InterviewSession.findOne({ _id: sessionId, user: userId });
  if (!session) throw new Error('Session not found');

  let totalScore = 0;
  let answeredCount = 0;
  
  const categoryScores = { 'Technical': [], 'Core ECE': [], 'Coding': [], 'HR': [] };
  
  session.questions.forEach(q => {
    // Only count successfully evaluated questions
    if (q.score !== null && !q.evaluationFailed) {
      totalScore += q.score;
      answeredCount++;
      if (categoryScores[q.category]) {
        categoryScores[q.category].push(q.score);
      } else {
        categoryScores['Technical'].push(q.score);
      }
    }
  });

  if (answeredCount === 0) {
    session.overallScore = 0;
  } else {
    session.overallScore = Math.round(totalScore / answeredCount);
  }

  const avg = (arr) => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : null;
  
  session.technicalScore = avg(categoryScores['Technical']);
  session.coreEceScore = avg(categoryScores['Core ECE']);
  session.codingScore = avg(categoryScores['Coding']);
  session.hrScore = avg(categoryScores['HR']);

  const weaknesses = [];
  const strengths = [];

  const categorize = (name, score) => {
    if (score === null) return;
    if (score < 60) weaknesses.push(`${name} (Score: ${score})`);
    else if (score >= 80) strengths.push(`${name} (Score: ${score})`);
  };

  categorize('Technical Knowledge', session.technicalScore);
  categorize('Core ECE Concepts', session.coreEceScore);
  categorize('Coding & DSA', session.codingScore);
  categorize('HR / Behavioral', session.hrScore);
  
  session.strengths = strengths;
  session.weaknesses = weaknesses;
  
  session.recommendations = [];
  if (weaknesses.length > 0) {
    session.recommendations.push(`Focus on improving: ${weaknesses.join(', ')}`);
  } else if (session.overallScore >= 80) {
    session.recommendations.push('Excellent performance! You are well prepared.');
  }

  session.status = 'Completed';
  session.completedAt = new Date();
  await session.save();

  try {
     await readinessService.calculateOverallReadiness(userId);
  } catch (err) {
     console.error('Failed to trigger readiness recalculation:', err.message);
  }

  return session;
};
