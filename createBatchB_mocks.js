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
  "frontend/src/mocks/notifications.js": `
export const mockNotifications = [
  { id: 1, title: 'New Test Available', message: 'The weekly VLSI mock test is now open.', type: 'info', date: '2026-07-24T10:00:00Z', isRead: false },
  { id: 2, title: 'Profile Incomplete', message: 'Please update your resume to unlock ATS analysis.', type: 'warning', date: '2026-07-23T15:30:00Z', isRead: false },
  { id: 3, title: 'Achievement Unlocked', message: 'You reached a 7-day study streak!', type: 'success', date: '2026-07-22T08:00:00Z', isRead: true }
];
  `,
  "frontend/src/mocks/quizzes.js": `
export const mockQuizzes = [
  { id: 'q1', title: 'Quantitative Aptitude - Level 1', duration: 30, totalQuestions: 20, difficulty: 'Easy', category: 'Aptitude' },
  { id: 'q2', title: 'Digital Electronics Basics', duration: 45, totalQuestions: 30, difficulty: 'Medium', category: 'Core ECE' },
  { id: 'q3', title: 'Data Structures in C++', duration: 60, totalQuestions: 25, difficulty: 'Hard', category: 'Coding' }
];

export const mockQuizQuestions = [
  { id: 'q1_1', text: 'If a train 120m long passes a pole in 6 seconds, what is its speed?', options: ['20 m/s', '30 m/s', '40 m/s', '50 m/s'], correctIndex: 0, explanation: 'Speed = Distance/Time = 120/6 = 20 m/s' },
  { id: 'q1_2', text: 'What is 15% of 60?', options: ['6', '9', '12', '15'], correctIndex: 1, explanation: '15/100 * 60 = 9' }
];

export const mockLeaderboard = [
  { rank: 1, name: 'Alice Smith', score: 980, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { rank: 2, name: 'Rahul Chavan', score: 945, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { rank: 3, name: 'John Doe', score: 910, avatar: null },
  { rank: 4, name: 'Sarah Connor', score: 890, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' }
];
  `,
  "frontend/src/mocks/subjects.js": `
export const mockSubjects = [
  { id: 'sub_1', name: 'Digital Electronics', progress: 85, difficulty: 'Medium', totalTopics: 12, completedTopics: 10, estimatedTime: '15h' },
  { id: 'sub_2', name: 'Analog Electronics', progress: 40, difficulty: 'Hard', totalTopics: 15, completedTopics: 6, estimatedTime: '20h' },
  { id: 'sub_3', name: 'Signals & Systems', progress: 10, difficulty: 'Hard', totalTopics: 10, completedTopics: 1, estimatedTime: '25h' },
  { id: 'sub_4', name: 'Communication Systems', progress: 0, difficulty: 'Medium', totalTopics: 14, completedTopics: 0, estimatedTime: '18h' },
  { id: 'sub_5', name: 'Control Systems', progress: 60, difficulty: 'Medium', totalTopics: 8, completedTopics: 5, estimatedTime: '12h' },
  { id: 'sub_6', name: 'Microprocessors', progress: 20, difficulty: 'Medium', totalTopics: 10, completedTopics: 2, estimatedTime: '16h' },
  { id: 'sub_7', name: 'Embedded Systems', progress: 5, difficulty: 'Hard', totalTopics: 12, completedTopics: 0, estimatedTime: '22h' },
  { id: 'sub_8', name: 'VLSI', progress: 0, difficulty: 'Hard', totalTopics: 16, completedTopics: 0, estimatedTime: '30h' },
  { id: 'sub_9', name: 'Power Electronics', progress: 0, difficulty: 'Medium', totalTopics: 9, completedTopics: 0, estimatedTime: '14h' },
];

export const mockSubjectDetails = {
  id: 'sub_1',
  name: 'Digital Electronics',
  overview: 'Study of digital logic gates, combinational and sequential circuits, and semiconductor memories.',
  learningOutcomes: [
    'Design and analyze combinational logic circuits',
    'Understand flip-flops, counters, and registers',
    'Minimize logic expressions using K-Maps',
    'Implement state machines'
  ],
  modules: [
    { title: 'Number Systems & Boolean Algebra', completed: true },
    { title: 'Logic Gates & K-Maps', completed: true },
    { title: 'Combinational Circuits', completed: false },
    { title: 'Sequential Circuits', completed: false }
  ]
};
  `,
  "frontend/src/mocks/index.js": `
export * from './users';
export * from './notifications';
export * from './quizzes';
export * from './subjects';
  `
};

writeFiles(files);
console.log('Batch B - Mocks generated.');
