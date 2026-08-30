const mongoose = require('mongoose');
require('dotenv').config();
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Subject = require('../models/Subject');

const seedAptitudeQuizzes = async () => {
  let isStandalone = false;
  try {
    isStandalone = require.main === module;
    
    if (mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI;
      if (!uri) throw new Error('MONGODB_URI environment variable is missing.');
      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri);
    }
    
    if (mongoose.connection.readyState === 2) {
      await new Promise(resolve => mongoose.connection.once('connected', resolve));
    }

    console.log('Connected to MongoDB. Starting Aptitude Quizzes seed...');

    const categories = [
      {
        name: 'Quantitative Aptitude',
        code: 'APT-QUANT',
        desc: 'Numerical ability and mathematical problem solving.'
      },
      {
        name: 'Logical Reasoning',
        code: 'APT-LR',
        desc: 'Analytical thinking and pattern recognition.'
      },
      {
        name: 'Verbal Ability',
        code: 'APT-VERBAL',
        desc: 'English grammar, vocabulary, and comprehension.'
      },
      {
        name: 'Data Interpretation',
        code: 'APT-DI',
        desc: 'Reading and analyzing charts, graphs, and tables.'
      }
    ];

    const quizzesData = [
      {
        categoryCode: 'APT-QUANT',
        title: 'Quantitative Aptitude Test 1',
        description: 'Practice fundamental quantitative aptitude questions commonly asked in engineering placements.',
        timeLimit: 30,
        passingScore: 60,
        questions: [
          {
            text: 'If the cost price of 20 articles is equal to the selling price of 15 articles, what is the profit percentage?',
            options: [
              { text: '25%', isCorrect: false },
              { text: '33.33%', isCorrect: true },
              { text: '20%', isCorrect: false },
              { text: '50%', isCorrect: false }
            ],
            explanation: 'Let CP of 1 article = 1. CP of 20 = 20. SP of 15 = 20. SP of 1 = 20/15 = 4/3. Profit % = ((4/3 - 1) / 1) * 100 = 33.33%.',
            difficulty: 'medium'
          },
          {
            text: 'A train 150m long is running at 72 km/hr. How long will it take to cross a pole?',
            options: [
              { text: '7.5 sec', isCorrect: true },
              { text: '12 sec', isCorrect: false },
              { text: '15 sec', isCorrect: false },
              { text: '10 sec', isCorrect: false }
            ],
            explanation: 'Speed in m/s = 72 * (5/18) = 20 m/s. Time = Distance/Speed = 150/20 = 7.5 seconds.',
            difficulty: 'easy'
          },
          {
            text: 'The average of first 50 natural numbers is:',
            options: [
              { text: '25.30', isCorrect: false },
              { text: '25.5', isCorrect: true },
              { text: '25.00', isCorrect: false },
              { text: '12.25', isCorrect: false }
            ],
            explanation: 'The sum of first N natural numbers is N(N+1)/2. Average = (N+1)/2 = 51/2 = 25.5.',
            difficulty: 'easy'
          }
        ]
      },
      {
        categoryCode: 'APT-LR',
        title: 'Logical Reasoning Practice',
        description: 'Test your analytical and logical thinking skills.',
        timeLimit: 20,
        passingScore: 50,
        questions: [
          {
            text: 'If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?',
            options: [
              { text: 'Nephew', isCorrect: false },
              { text: 'Niece', isCorrect: false },
              { text: 'Cannot be determined', isCorrect: true },
              { text: 'Brother', isCorrect: false }
            ],
            explanation: 'D\'s gender is not mentioned, so D can be either nephew or niece to A.',
            difficulty: 'medium'
          },
          {
            text: 'Look at this series: 2, 6, 18, 54, ... What number should come next?',
            options: [
              { text: '108', isCorrect: false },
              { text: '148', isCorrect: false },
              { text: '162', isCorrect: true },
              { text: '216', isCorrect: false }
            ],
            explanation: 'Each number is multiplied by 3 to get the next number (54 * 3 = 162).',
            difficulty: 'easy'
          }
        ]
      },
      {
        categoryCode: 'APT-VERBAL',
        title: 'Verbal Ability Challenge',
        description: 'Grammar and vocabulary assessment for placements.',
        timeLimit: 15,
        passingScore: 70,
        questions: [
          {
            text: 'Choose the correct synonym for "UBIQUITOUS":',
            options: [
              { text: 'Rare', isCorrect: false },
              { text: 'Omnipresent', isCorrect: true },
              { text: 'Wealthy', isCorrect: false },
              { text: 'Temporary', isCorrect: false }
            ],
            explanation: 'Ubiquitous means present, appearing, or found everywhere (omnipresent).',
            difficulty: 'medium'
          }
        ]
      },
      {
        categoryCode: 'APT-DI',
        title: 'Data Interpretation Basics',
        description: 'Foundations of chart and data analysis.',
        timeLimit: 25,
        passingScore: 60,
        questions: [
          {
            text: 'If the total sales of a company is $500,000 and the profit margin is 12%, what is the total profit?',
            options: [
              { text: '$60,000', isCorrect: true },
              { text: '$50,000', isCorrect: false },
              { text: '$12,000', isCorrect: false },
              { text: '$72,000', isCorrect: false }
            ],
            explanation: 'Profit = 12% of 500,000 = (12/100) * 500000 = 60,000.',
            difficulty: 'easy'
          }
        ]
      }
    ];

    let totalQuizzesSeeded = 0;
    let totalQuestionsSeeded = 0;

    for (const cat of categories) {
      let subject = await Subject.findOne({ name: cat.name });
      if (!subject) {
        subject = await Subject.create({
          name: cat.name,
          description: cat.desc,
          code: cat.code,
          isActive: true
        });
        console.log(`Created new Subject: ${subject.name} (${subject.code})`);
      } else {
        if (!subject.code || subject.code !== cat.code) {
          subject.code = cat.code;
          await subject.save();
        }
        console.log(`Subject already exists: ${subject.name} (${subject.code})`);
      }
    }

    for (const quizData of quizzesData) {
      const subject = await Subject.findOne({ code: quizData.categoryCode });
      if (!subject) throw new Error(`Subject ${quizData.categoryCode} not found.`);

      const quiz = await Quiz.findOneAndUpdate(
        { subject: subject._id, title: quizData.title },
        {
          title: quizData.title,
          description: quizData.description,
          subject: subject._id,
          timeLimit: quizData.timeLimit,
          passingScore: quizData.passingScore,
          isActive: true
        },
        { upsert: true, new: true }
      );

      console.log(`Quiz Upserted: ${quiz.title}`);
      totalQuizzesSeeded++;

      for (const mcq of quizData.questions) {
        await Question.findOneAndUpdate(
          { quiz: quiz._id, text: mcq.text },
          {
            ...mcq,
            quiz: quiz._id
          },
          { upsert: true, new: true }
        );
        totalQuestionsSeeded++;
      }
    }

    console.log(`✅ Successfully seeded ${totalQuizzesSeeded} Aptitude Quizzes and ${totalQuestionsSeeded} Questions.`);
    
    if (isStandalone) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding aptitude quizzes:', error);
    if (isStandalone) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedAptitudeQuizzes();
}

module.exports = seedAptitudeQuizzes;
