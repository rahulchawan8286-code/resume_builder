const mongoose = require('mongoose');
require('dotenv').config();
const Company = require('./src/models/Company');

const companies = [
  {
    name: "Qualcomm",
    description: "[DEVELOPMENT DATA] Qualcomm is a global leader in the development and commercialization of foundational technologies for the wireless industry.",
    website: "https://www.qualcomm.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Qualcomm-Logo.svg/1200px-Qualcomm-Logo.svg.png",
    industry: "Semiconductor",
    eligibility: "[DEVELOPMENT DATA] B.Tech in ECE/CS, CGPA > 7.5. No active backlogs.",
    requiredSkills: ["C", "C++", "Data Structures", "Embedded C", "Digital Electronics"],
    interviewRounds: [
      { title: "Aptitude & Technical Test", desc: "Focuses on quantitative, logical, and core subjects (Digital Electronics, C programming)." },
      { title: "Technical Interview 1", desc: "In-depth questions on resumes, projects, and Data Structures." },
      { title: "Technical Interview 2", desc: "Core ECE concepts (Microcontrollers, Verilog/VLSI basics)." },
      { title: "HR Round", desc: "Behavioral questions and cultural fit." }
    ],
    openRoles: [
      { title: "Embedded Software Engineer", description: "Develop and test embedded firmware.", requirements: "Proficiency in C/C++, RTOS concepts.", applyLink: "#" },
      { title: "Hardware Engineer", description: "Design and verify SoC architecture.", requirements: "Verilog, VLSI design principles.", applyLink: "#" }
    ]
  },
  {
    name: "Texas Instruments",
    description: "[DEVELOPMENT DATA] Texas Instruments designs and manufactures semiconductors and various integrated circuits.",
    website: "https://www.ti.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Texas_Instruments_logo.svg/1200px-Texas_Instruments_logo.svg.png",
    industry: "Semiconductor",
    eligibility: "[DEVELOPMENT DATA] B.Tech in ECE/EEE, CGPA > 8.0. Strong fundamentals.",
    requiredSkills: ["Analog Electronics", "Digital Electronics", "Network Theory", "C"],
    interviewRounds: [
      { title: "Online Assessment", desc: "Core electronics subjects (Network Theory, Analog, Digital)." },
      { title: "Technical Interview", desc: "Deep dive into analog/digital circuits, operational amplifiers." },
      { title: "HR Interview", desc: "General HR questions." }
    ],
    openRoles: [
      { title: "Analog Design Engineer", description: "Design complex analog circuits.", requirements: "Deep understanding of Analog Electronics, OP-AMPs.", applyLink: "#" }
    ]
  },
  {
    name: "TCS",
    description: "[DEVELOPMENT DATA] Tata Consultancy Services is an Indian multinational information technology services and consulting company.",
    website: "https://www.tcs.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/1200px-Tata_Consultancy_Services_Logo.svg.png",
    industry: "IT/Software",
    eligibility: "[DEVELOPMENT DATA] B.Tech in any branch, CGPA > 6.0.",
    requiredSkills: ["C", "Java", "Python", "Data Structures", "Quantitative Aptitude"],
    interviewRounds: [
      { title: "TCS NQT", desc: "National Qualifier Test: Aptitude, Logical, Verbal, and Basic Coding." },
      { title: "Technical Interview", desc: "Basic programming, oops concepts, database management." },
      { title: "Managerial & HR", desc: "General behavioral questions." }
    ],
    openRoles: [
      { title: "Systems Engineer", description: "Software development and IT consulting.", requirements: "Good programming and communication skills.", applyLink: "#" }
    ]
  }
];

const seedCompanies = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ece_compass';
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB...');

    for (let comp of companies) {
      const existing = await Company.findOne({ name: comp.name });
      if (existing) {
        // Update to ensure schema changes are applied
        await Company.updateOne({ _id: existing._id }, { $set: comp });
        console.log(`Updated company: ${comp.name}`);
      } else {
        await Company.create(comp);
        console.log(`Created company: ${comp.name}`);
      }
    }

    console.log('Seeding companies completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding companies:', error);
    process.exit(1);
  }
};

seedCompanies();
