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