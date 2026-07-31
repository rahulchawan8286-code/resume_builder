const fs = require('fs');
const path = require('path');

const writeFiles = (files) => {
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content.trim(), 'utf8');
  });
};

const files = {
  "frontend/src/mocks/ai.js": `
export const mockAIAssistantChat = [
  { id: 1, role: 'ai', content: 'Hello! I am your AI Career Mentor. How can I help you prepare for your placements today?' },
  { id: 2, role: 'user', content: 'Can you explain how a setup and hold time violation occurs in a D flip-flop?' },
  { id: 3, role: 'ai', content: 'Certainly!\n\n**Setup Time Violation:** Occurs when the input data signal changes too close to the active clock edge, failing to remain stable for the required minimum time *before* the clock edge.\n\n**Hold Time Violation:** Occurs when the data signal changes too soon *after* the active clock edge, failing to remain stable for the required minimum time.\n\nTo fix them, we generally adjust the data path delay or clock routing.' }
];

export const mockAIStudyPlanner = {
  week: 'Week 1',
  goal: 'Master Digital Logic and Array problems',
  progress: 40,
  dailyPlan: [
    { day: 'Monday', tasks: ['Read Logic Gates Notes', 'Solve 5 Easy Array Problems'], completed: true },
    { day: 'Tuesday', tasks: ['Take Digital Logic Mock Test', 'Solve 2 Medium Array Problems'], completed: false },
    { day: 'Wednesday', tasks: ['Review Mock Test Mistakes', 'Learn Linked Lists'], completed: false }
  ],
  recommendations: 'Focus on your speed when solving K-map problems. You took an average of 4 minutes per question yesterday.'
};

export const mockAIMockInterview = {
  score: 85,
  feedback: 'Excellent communication skills. Technical answers were accurate, but lacked depth in real-world examples.',
  confidence: 'High',
  improvement: 'Practice STAR method for behavioral questions. Review your IoT project architecture for follow-up questions.',
  questionsAsked: [
    { q: 'Tell me about yourself.', type: 'HR', performance: 'Great' },
    { q: 'How does an I2C bus work?', type: 'Technical', performance: 'Good' },
    { q: 'Describe a time you failed.', type: 'Behavioral', performance: 'Needs Improvement' }
  ]
};
  `,
  "frontend/src/mocks/admin.js": `
export const mockAdminStats = {
  totalUsers: 15234,
  activeUsers: 8432,
  totalTests: 45678,
  aiUsage: 120450,
  dailyTraffic: 4500,
  systemHealth: '99.9% Uptime'
};

export const mockUsersList = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', role: 'student', status: 'Active', joinDate: '2026-01-15' },
  { id: 'u2', name: 'Bob Jones', email: 'bob@example.com', role: 'student', status: 'Active', joinDate: '2026-02-20' },
  { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'admin', status: 'Active', joinDate: '2025-11-01' },
];

export const mockQuestionsList = [
  { id: 'q1', title: 'Two Sum', category: 'Coding', difficulty: 'Easy', author: 'Admin' },
  { id: 'q2', title: 'K-Map Minimization', category: 'Core ECE', difficulty: 'Medium', author: 'Admin' },
];
  `,
  "frontend/src/mocks/index.js": `
export * from './users';
export * from './notifications';
export * from './quizzes';
export * from './subjects';
export * from './coding';
export * from './resume';
export * from './companies';
export * from './ai';
export * from './admin';
  `
};

writeFiles(files);
console.log('Batch D - Mocks generated.');
