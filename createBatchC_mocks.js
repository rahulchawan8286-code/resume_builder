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
  "frontend/src/mocks/coding.js": `
export const mockCodingProblems = [
  { id: 'c1', title: 'Two Sum', difficulty: 'Easy', acceptance: '51%', tags: ['Array', 'Hash Table'] },
  { id: 'c2', title: 'Reverse Linked List', difficulty: 'Easy', acceptance: '75%', tags: ['Linked List', 'Recursion'] },
  { id: 'c3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: '34%', tags: ['Hash Table', 'String', 'Sliding Window'] },
  { id: 'c4', title: 'Merge k Sorted Lists', difficulty: 'Hard', acceptance: '52%', tags: ['Linked List', 'Divide and Conquer', 'Heap'] },
  { id: 'c5', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', acceptance: '40%', tags: ['Tree', 'DFS', 'Dynamic Programming'] },
];

export const mockProblemDetails = {
  id: 'c1',
  title: 'Two Sum',
  difficulty: 'Easy',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
  timeLimit: '2 Seconds',
  memoryLimit: '256 MB',
  sampleInput: 'nums = [2,7,11,15], target = 9',
  sampleOutput: '[0,1]',
  explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
  hints: ['A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it is best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.', 'So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array keeping how a hashtable works?'],
};

export const mockSubmissions = [
  { id: 'sub1', problemId: 'c1', problemTitle: 'Two Sum', status: 'Accepted', runtime: '48 ms', memory: '42.1 MB', language: 'C++', date: '2026-07-24T10:00:00Z' },
  { id: 'sub2', problemId: 'c2', problemTitle: 'Reverse Linked List', status: 'Wrong Answer', runtime: 'N/A', memory: 'N/A', language: 'Python', date: '2026-07-23T15:30:00Z' },
  { id: 'sub3', problemId: 'c3', problemTitle: 'Longest Substring', status: 'Time Limit Exceeded', runtime: 'N/A', memory: 'N/A', language: 'Java', date: '2026-07-22T08:00:00Z' }
];
  `,
  "frontend/src/mocks/resume.js": `
export const mockResumeData = {
  personalInfo: {
    fullName: 'Rahul Chavan',
    email: 'rahul@example.com',
    phone: '+91 9876543210',
    linkedin: 'linkedin.com/in/rahul',
    github: 'github.com/rahul',
    portfolio: 'rahul.dev',
    summary: 'A highly motivated Electronics and Communication Engineering student with a strong foundation in digital systems and modern software development.'
  },
  education: [
    { degree: 'B.Tech in Electronics and Communication', institution: 'Engineering Institute of Technology', startYear: '2023', endYear: '2027', gpa: '8.5/10' }
  ],
  skills: ['C++', 'Python', 'React', 'Node.js', 'Verilog', 'MATLAB', 'IoT', 'Embedded C'],
  projects: [
    { title: 'Smart Home Automation', description: 'IoT based home automation using ESP32 and MQTT protocol.', link: 'github.com/rahul/iot-home' },
    { title: 'ECE Career Compass', description: 'AI-powered placement preparation portal.', link: 'github.com/rahul/ece-compass' }
  ],
  experience: [],
  certifications: ['AWS Certified Cloud Practitioner', 'Cisco CCNA'],
  achievements: ['1st Runner Up at National Hackathon 2025', 'Top 1% in NPTEL Digital Circuits course'],
  languages: ['English', 'Hindi', 'Marathi']
};

export const mockATSReport = {
  score: 78,
  missingKeywords: ['Agile', 'Docker', 'Testing', 'RTOS', 'PCB Design'],
  weakSkills: ['Experience section is empty', 'Summary could be more impactful'],
  grammarSuggestions: ['Consider replacing "highly motivated" with a more specific action verb like "driven".'],
  formattingSuggestions: ['Ensure consistent bullet point styles.'],
  aiRecommendations: 'Your resume shows strong academic projects, but lacks professional experience. Try adding any open-source contributions or internships to boost your ATS score for top product companies.',
  history: [
    { date: '2026-07-20', score: 65 },
    { date: '2026-07-22', score: 72 },
    { date: '2026-07-24', score: 78 }
  ]
};
  `,
  "frontend/src/mocks/companies.js": `
export const mockCompanies = [
  { id: 'comp_intel', name: 'Intel', logo: 'https://logo.clearbit.com/intel.com', industry: 'Semiconductor', type: 'Core', match: 85, hiringProcess: 'Aptitude -> Technical (Core) -> Technical (Coding) -> HR' },
  { id: 'comp_qualcomm', name: 'Qualcomm', logo: 'https://logo.clearbit.com/qualcomm.com', industry: 'Semiconductor', type: 'Core', match: 92, hiringProcess: 'Online Test -> Technical 1 -> Technical 2 -> HR' },
  { id: 'comp_ti', name: 'Texas Instruments', logo: 'https://logo.clearbit.com/ti.com', industry: 'Semiconductor', type: 'Core', match: 78, hiringProcess: 'Online Test -> Technical Interview -> HR' },
  { id: 'comp_tcs', name: 'TCS', logo: 'https://logo.clearbit.com/tcs.com', industry: 'IT Services', type: 'Service', match: 95, hiringProcess: 'NQT Test -> Technical Interview -> HR' },
  { id: 'comp_infosys', name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com', industry: 'IT Services', type: 'Service', match: 90, hiringProcess: 'Online Test -> Technical + HR Interview' },
  { id: 'comp_bosch', name: 'Bosch', logo: 'https://logo.clearbit.com/bosch.com', industry: 'Automotive / Embedded', type: 'Core', match: 88, hiringProcess: 'Online Test (Aptitude + Core) -> Technical Interview -> HR' }
];

export const mockCompanyDetails = {
  id: 'comp_intel',
  name: 'Intel',
  logo: 'https://logo.clearbit.com/intel.com',
  description: 'Intel is a global leader in semiconductor design and manufacturing.',
  eligibility: 'B.Tech ECE/CSE with minimum 7.5 CGPA. No active backlogs.',
  requiredSkills: ['Verilog/VHDL', 'Computer Architecture', 'Digital Logic Design', 'C/C++', 'Scripting (Python/Perl)'],
  interviewRounds: [
    { title: 'Online Assessment', desc: 'Aptitude (20 mins), Digital Electronics (30 mins), Coding (45 mins)' },
    { title: 'Technical Round 1', desc: 'Focus on Resume projects, Core Subjects (VLSI, Digital), Puzzles.' },
    { title: 'Technical Round 2', desc: 'In-depth architecture questions, setup time, hold time, and coding.' },
    { title: 'HR Round', desc: 'Behavioral questions, relocation, career goals.' }
  ],
  aptitudeFocus: 30,
  coreECEFocus: 50,
  codingFocus: 20,
  aiReadinessScore: 82,
  roadmap: [
    { month: 'Month 1', task: 'Master Digital Logic and Verilog syntax. Complete 50 aptitude questions weekly.' },
    { month: 'Month 2', task: 'Study Computer Architecture in depth. Practice C++ bit manipulation.' },
    { month: 'Month 3', task: 'Build a mini-project in Verilog. Take full-length Intel mock tests.' }
  ]
};
  `,
  "frontend/src/mocks/index.js": `
export * from './users';
export * from './notifications';
export * from './quizzes';
export * from './subjects';
export * from './coding';
export * from './resume';
export * from './companies';
  `
};

writeFiles(files);
console.log('Batch C - Mocks generated.');
