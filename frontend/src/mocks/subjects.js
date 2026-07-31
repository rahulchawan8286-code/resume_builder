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