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