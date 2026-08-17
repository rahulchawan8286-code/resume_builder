const Roadmap = require('../models/Roadmap');
const Readiness = require('../models/Readiness');
const Resume = require('../models/Resume');
const Company = require('../models/Company');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Utility to normalize skills
const normalizeSkill = (skill) => {
  if (!skill) return '';
  return skill.toString().toLowerCase().trim()
    .replace(/\\bplus\\b/gi, '+')
    .replace(/[^a-z0-9+#]/g, '');
};

const DEFAULT_ECE_SKILLS = [
  'c', 'c++', 'datastructures', 'embeddedc', 'microcontrollers', 
  'digitalelectronics', 'communicationprotocols', 'python', 'verilog', 'vlsi'
];

// Helper to extract skills from text
const extractSkillsFromText = (text) => {
  if (!text) return [];
  const normalizedText = text.toLowerCase();
  const foundSkills = new Set();
  
  // Basic heuristic keyword extraction
  const keywords = {
    'c++': 'C++', 'cpp': 'C++', 'c plus plus': 'C++',
    'c': 'C', 'embedded c': 'Embedded C',
    'python': 'Python', 'java': 'Java',
    'data structures': 'Data Structures', 'dsa': 'Data Structures',
    'embedded systems': 'Embedded Systems', 'microcontrollers': 'Microcontrollers',
    'digital electronics': 'Digital Electronics', 'vlsi': 'VLSI',
    'verilog': 'Verilog', 'vhdl': 'VHDL',
    'communication': 'Communication Protocols', 'iot': 'IoT'
  };

  for (const [key, standardized] of Object.entries(keywords)) {
    if (normalizedText.includes(key)) {
      foundSkills.add(standardized);
    }
  }
  return Array.from(foundSkills);
};

exports.generateDeterministicRoadmap = async (userId, targetCompanyId = null) => {
  // Fetch existing data
  const readiness = await Readiness.findOne({ user: userId });
  const resume = await Resume.findOne({ user: userId });
  
  let targetCompany = null;
  let companyRequirements = [];
  
  if (targetCompanyId) {
    targetCompany = await Company.findById(targetCompanyId);
    if (targetCompany) {
      targetCompany.openRoles.forEach(role => {
        const skills = extractSkillsFromText(role.requirements + " " + role.description);
        skills.forEach(s => { if (!companyRequirements.includes(s)) companyRequirements.push(s); });
      });
    }
  }

  if (companyRequirements.length === 0) {
    // General ECE fallback
    companyRequirements = ['C', 'C++', 'Data Structures', 'Embedded C', 'Digital Electronics'];
  }

  // Extract student skills
  const studentSkillsRaw = [];
  if (resume && resume.skills) {
    if (resume.skills.technical) studentSkillsRaw.push(...resume.skills.technical);
    if (resume.skills.soft) studentSkillsRaw.push(...resume.skills.soft);
  }
  
  const studentSkillsNormalized = studentSkillsRaw.map(normalizeSkill);
  
  // 1. Skill Gap Analysis & Priority Engine
  const skillGaps = [];
  
  companyRequirements.forEach(req => {
    const isMissing = !studentSkillsNormalized.includes(normalizeSkill(req));
    
    if (isMissing) {
      let priority = 'Low';
      let reason = 'Useful skill for ECE placement.';
      
      // Determine priority deterministically
      const codingScore = readiness?.components?.coding?.score ?? 100;
      const coreScore = readiness?.components?.coreECE?.score ?? 100;

      const isCoreSkill = ['Embedded C', 'Microcontrollers', 'Digital Electronics', 'VLSI'].includes(req);
      const isCodingSkill = ['C', 'C++', 'Data Structures', 'Python'].includes(req);

      if (targetCompanyId) {
        if (isCodingSkill && codingScore < 50) {
          priority = 'Critical';
          reason = `Critical company requirement. Your coding readiness is low (${Math.round(codingScore)}%).`;
        } else if (isCoreSkill && coreScore < 50) {
          priority = 'Critical';
          reason = `Critical company requirement. Your core ECE readiness is low (${Math.round(coreScore)}%).`;
        } else {
          priority = 'High';
          reason = 'Required by target company.';
        }
      } else {
        if (isCodingSkill && codingScore < 60) {
          priority = 'High';
          reason = `Important core skill. Coding readiness is at ${Math.round(codingScore)}%.`;
        } else if (isCoreSkill && coreScore < 60) {
          priority = 'High';
          reason = `Important core skill. Core ECE readiness is at ${Math.round(coreScore)}%.`;
        } else {
          priority = 'Medium';
          reason = 'General ECE industry standard requirement.';
        }
      }
      
      skillGaps.push({ skill: req, priority, reason });
    }
  });

  // Also add gaps based purely on Readiness if they lack skills
  if ((readiness?.components?.aptitude?.score ?? 100) < 60) {
    skillGaps.push({ skill: 'Quantitative Aptitude', priority: 'High', reason: 'Aptitude readiness score is below target.' });
  }
  if ((readiness?.components?.resume?.score ?? 100) < 70) {
    skillGaps.push({ skill: 'Resume Building', priority: 'Medium', reason: 'Resume completeness needs improvement.' });
  }
  if ((readiness?.components?.interview?.score ?? 100) < 50) {
    skillGaps.push({ skill: 'Interview Preparation', priority: 'Medium', reason: 'Mock interview performance needs improvement.' });
  }

  // 2. Roadmap Generation Engine
  const weeks = [];
  const numWeeks = 4;
  
  // Sort gaps by priority to distribute them
  const priorityWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
  skillGaps.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

  // Distribute tasks across 4 weeks
  for (let i = 1; i <= numWeeks; i++) {
    const tasks = [];
    
    // Aptitude task every week
    tasks.push({
      title: `Practice ${i * 10} Aptitude Problems`,
      category: 'Aptitude',
      description: 'Focus on percentages, ratios, time & work, and logical reasoning.',
      priority: i === 1 ? 'High' : 'Medium',
      estimatedMinutes: 60
    });

    // Add tasks from skill gaps
    if (skillGaps.length > 0) {
       // Distribute gaps over weeks
       const gapForWeek = skillGaps[(i - 1) % skillGaps.length];
       
       let category = 'Core ECE';
       if (['C', 'C++', 'Data Structures', 'Python'].includes(gapForWeek.skill)) category = 'Coding';
       else if (gapForWeek.skill === 'Resume Building') category = 'Resume';
       else if (gapForWeek.skill === 'Interview Preparation') category = 'Interview';

       tasks.push({
         title: `Master ${gapForWeek.skill} fundamentals`,
         category: category,
         description: gapForWeek.reason,
         priority: gapForWeek.priority,
         estimatedMinutes: 120
       });
    }

    if (i === 4) {
      tasks.push({
        title: 'Conduct a Full Mock Interview',
        category: 'Interview',
        description: 'Test your overall preparation across all categories.',
        priority: 'High',
        estimatedMinutes: 90
      });
    }

    weeks.push({
      weekNumber: i,
      title: `Week ${i}: ${i <= 2 ? 'Foundation Building' : 'Advanced Practice'}`,
      tasks
    });
  }

  // 3. Preserve Old Progress (If regenerating)
  const existingRoadmap = await Roadmap.findOne({ user: userId, targetCompany: targetCompanyId });
  if (existingRoadmap) {
    // Map old completions by title
    const completedTasksMap = {};
    existingRoadmap.weeks.forEach(w => {
      w.tasks.forEach(t => {
        if (t.isCompleted) completedTasksMap[t.title.toLowerCase()] = t.completedAt;
      });
    });

    weeks.forEach(w => {
      w.tasks.forEach(t => {
        if (completedTasksMap[t.title.toLowerCase()]) {
          t.isCompleted = true;
          t.completedAt = completedTasksMap[t.title.toLowerCase()];
        }
      });
    });
  }

  // Recalculate Progress
  let totalTasks = 0;
  let completedTasks = 0;
  weeks.forEach(w => {
    w.tasks.forEach(t => {
      totalTasks++;
      if (t.isCompleted) completedTasks++;
    });
  });
  
  let overallProgress = 0;
  if (totalTasks > 0) {
    overallProgress = Math.min(100, Math.max(0, Math.round((completedTasks / totalTasks) * 100)));
  }

  // Save or Update Roadmap
  if (existingRoadmap) {
    existingRoadmap.targetCompany = targetCompanyId || existingRoadmap.targetCompany;
    existingRoadmap.skillGaps = skillGaps;
    existingRoadmap.weeks = weeks;
    existingRoadmap.overallProgress = overallProgress;
    existingRoadmap.lastGeneratedAt = new Date();
    await existingRoadmap.save();
    return existingRoadmap;
  } else {
    const newRoadmap = new Roadmap({
      user: userId,
      targetCompany: targetCompanyId,
      skillGaps,
      weeks,
      overallProgress
    });
    await newRoadmap.save();
    return newRoadmap;
  }
};

exports.calculateProgress = async (roadmapId) => {
  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) throw new Error('Roadmap not found');

  let total = 0;
  let completed = 0;

  roadmap.weeks.forEach(w => {
    w.tasks.forEach(t => {
      total++;
      if (t.isCompleted) completed++;
    });
  });

  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  roadmap.overallProgress = Math.min(100, Math.max(0, progress));
  await roadmap.save();
  return roadmap.overallProgress;
};

exports.aiPersonalizeRoadmap = async (userId, targetCompanyId = null) => {
  const roadmap = await Roadmap.findOne({ user: userId, targetCompany: targetCompanyId });
  if (!roadmap) throw new Error('Roadmap not found');

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
      // Fallback deterministic analysis if AI is unavailable (Don't modify, just return)
      return roadmap;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Only pass task metadata, do NOT let AI regenerate the array structure, only enhance descriptions
  const tasksPayload = roadmap.weeks.map(w => 
    w.tasks.map(t => ({ id: t._id, title: t.title, currentDesc: t.description }))
  ).flat();

  const prompt = `
  Enhance these study tasks for a student preparing for engineering placement.
  Provide slightly more personalized, actionable descriptions for each. Do not change the IDs.
  Data: ${JSON.stringify(tasksPayload)}
  
  Format strictly as JSON array of objects: [{ "id": "...", "enhancedDescription": "..." }]. Do not include markdown formatting or backticks around the JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\\n/g, '').replace(/```\\n/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(text);
    
    if (Array.isArray(parsed)) {
      const descMap = {};
      parsed.forEach(p => {
        if (p.id && p.enhancedDescription) descMap[p.id] = p.enhancedDescription;
      });

      // Update descriptions in place securely
      roadmap.weeks.forEach(w => {
        w.tasks.forEach(t => {
          if (descMap[t._id.toString()]) {
            t.description = descMap[t._id.toString()];
          }
        });
      });
      roadmap.lastAiPersonalizedAt = new Date();
      await roadmap.save();
    }
  } catch (err) {
    console.error('AI Personalization Failed, using deterministic roadmap:', err.message);
  }

  return roadmap;
};
