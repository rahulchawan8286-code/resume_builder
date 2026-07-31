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