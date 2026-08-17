const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./src/models/Subject');
const Quiz = require('./src/models/Quiz');
const Question = require('./src/models/Question');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ece_career_compass';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB.');

    // 1. Subjects
    const subjectsToSeed = [
      { name: 'Quantitative Aptitude', code: 'APT-QA', description: 'Basic mathematics and problem solving.' },
      { name: 'Logical Reasoning', code: 'APT-LR', description: 'Analytical and logical thinking.' },
      { name: 'Verbal Ability', code: 'APT-VA', description: 'English grammar and comprehension.' },
      { name: 'Digital Electronics', code: 'ECE-DE', description: 'Logic gates, boolean algebra, combinational circuits.' },
      { name: 'Analog Electronics', code: 'ECE-AE', description: 'Diodes, BJTs, Op-Amps.' },
      { name: 'Communication Systems', code: 'ECE-CS', description: 'Analog and digital communications.' },
    ];

    let subjectsCreated = 0;
    let subjectsExisting = 0;
    const subjectMap = {};

    for (const sub of subjectsToSeed) {
      const existing = await Subject.findOne({ name: sub.name });
      if (!existing) {
        const created = await Subject.create(sub);
        subjectMap[sub.name] = created._id;
        subjectsCreated++;
      } else {
        subjectMap[sub.name] = existing._id;
        subjectsExisting++;
      }
    }

    // 2. Quizzes
    const quizzesToSeed = [
      {
        title: 'Basic Speed Math',
        description: 'Test your calculation speed with these basic quantitative aptitude questions.',
        subjectName: 'Quantitative Aptitude',
        timeLimit: 10,
        passingScore: 60
      },
      {
        title: 'Number Series & Sequences',
        description: 'Find the missing numbers in logical series.',
        subjectName: 'Logical Reasoning',
        timeLimit: 15,
        passingScore: 50
      },
      {
        title: 'Digital Logic Gates Basics',
        description: 'Fundamental concepts of digital logic gates and Boolean algebra.',
        subjectName: 'Digital Electronics',
        timeLimit: 20,
        passingScore: 70
      }
    ];

    let quizzesCreated = 0;
    let quizzesExisting = 0;
    const quizMap = {};

    for (const q of quizzesToSeed) {
      const subjectId = subjectMap[q.subjectName];
      if (!subjectId) continue;
      
      const existing = await Quiz.findOne({ title: q.title, subject: subjectId });
      if (!existing) {
        const created = await Quiz.create({
          title: q.title,
          description: q.description,
          subject: subjectId,
          timeLimit: q.timeLimit,
          passingScore: q.passingScore
        });
        quizMap[q.title] = created._id;
        quizzesCreated++;
      } else {
        quizMap[q.title] = existing._id;
        quizzesExisting++;
      }
    }

    // 3. Questions
    const questionsToSeed = [
      {
        quizTitle: 'Basic Speed Math',
        text: 'What is 15% of 200?',
        options: [
          { text: '20', isCorrect: false },
          { text: '25', isCorrect: false },
          { text: '30', isCorrect: true },
          { text: '35', isCorrect: false }
        ],
        explanation: '15/100 * 200 = 30.',
        difficulty: 'easy'
      },
      {
        quizTitle: 'Basic Speed Math',
        text: 'If a train travels 60 km in 1.5 hours, what is its speed?',
        options: [
          { text: '30 km/hr', isCorrect: false },
          { text: '40 km/hr', isCorrect: true },
          { text: '45 km/hr', isCorrect: false },
          { text: '50 km/hr', isCorrect: false }
        ],
        explanation: 'Speed = Distance / Time = 60 / 1.5 = 40 km/hr.',
        difficulty: 'medium'
      },
      {
        quizTitle: 'Number Series & Sequences',
        text: 'Find the next number in the series: 2, 6, 12, 20, ?',
        options: [
          { text: '24', isCorrect: false },
          { text: '28', isCorrect: false },
          { text: '30', isCorrect: true },
          { text: '32', isCorrect: false }
        ],
        explanation: 'Differences are 4, 6, 8, so next difference is 10. 20 + 10 = 30.',
        difficulty: 'medium'
      },
      {
        quizTitle: 'Digital Logic Gates Basics',
        text: 'Which gate produces a HIGH output only when all its inputs are HIGH?',
        options: [
          { text: 'OR', isCorrect: false },
          { text: 'NAND', isCorrect: false },
          { text: 'AND', isCorrect: true },
          { text: 'NOR', isCorrect: false }
        ],
        explanation: 'The AND gate outputs 1 only when all inputs are 1.',
        difficulty: 'easy'
      },
      {
        quizTitle: 'Digital Logic Gates Basics',
        text: 'According to De Morgan\'s theorem, (A + B)\' is equal to:',
        options: [
          { text: 'A\' + B\'', isCorrect: false },
          { text: 'A\' * B\'', isCorrect: true },
          { text: 'A * B', isCorrect: false },
          { text: 'A + B', isCorrect: false }
        ],
        explanation: 'The complement of a sum of variables is equal to the product of their complements.',
        difficulty: 'medium'
      }
    ];

    let questionsCreated = 0;
    let questionsExisting = 0;

    for (const q of questionsToSeed) {
      const quizId = quizMap[q.quizTitle];
      if (!quizId) continue;
      
      const existing = await Question.findOne({ quiz: quizId, text: q.text });
      if (!existing) {
        await Question.create({
          quiz: quizId,
          text: q.text,
          options: q.options,
          explanation: q.explanation,
          difficulty: q.difficulty
        });
        questionsCreated++;
      } else {
        questionsExisting++;
      }
    }

    console.log('--- Seeding Results ---');
    console.log(`Subjects: ${subjectsCreated} created, ${subjectsExisting} existing.`);
    console.log(`Quizzes: ${quizzesCreated} created, ${quizzesExisting} existing.`);
    console.log(`Questions: ${questionsCreated} created, ${questionsExisting} existing.`);

    mongoose.disconnect();
    console.log('Done.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
