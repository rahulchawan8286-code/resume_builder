export const mockAIAssistantChat = [
  { id: 1, role: 'ai', content: 'Hello! I am your AI Career Mentor. How can I help you prepare for your placements today?' },
  { id: 2, role: 'user', content: 'Can you explain how a setup and hold time violation occurs in a D flip-flop?' },
  { id: 3, role: 'ai', content: `Certainly!

**Setup Time Violation:** Occurs when the input data signal changes too close to the active clock edge, failing to remain stable for the required minimum time *before* the clock edge.

**Hold Time Violation:** Occurs when the data signal changes too soon *after* the active clock edge, failing to remain stable for the required minimum time.

To fix them, we generally adjust the data path delay or clock routing.` }
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