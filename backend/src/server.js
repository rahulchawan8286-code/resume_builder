require('dotenv').config();
const app = require('./app');
const logger = require('./logger/winston');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const seedDigitalElectronics = require('./scripts/seedDigitalElectronics');
const Note = require('./models/Note');
const Subject = require('./models/Subject');

// Connect to Database
connectDB().then(async () => {
  try {
    // Auto-seed in production if notes are completely empty for the active ECE subject
    let subject = await Subject.findOne({ code: 'ECE-DE' });
    if (!subject) {
      subject = await Subject.findOne({ name: 'Digital Electronics' });
    }
    
    if (subject) {
      const count = await Note.countDocuments({ subject: subject._id });
      if (count === 0 || !subject.code) {
        logger.info('Auto-seeding Digital Electronics notes into production database...');
        await seedDigitalElectronics();
      }
      
      // Auto-seed the Practice Test Quiz if it does not exist
      logger.info('[PROD-SEED] Checking Digital Electronics quiz...');
      const Quiz = require('./models/Quiz');
      const Question = require('./models/Question');
      const practiceQuiz = await Quiz.findOne({ subject: subject._id, title: 'Digital Electronics Practice Test' });
      
      let needsSeed = true;
      if (practiceQuiz) {
        const questionCount = await Question.countDocuments({ quiz: practiceQuiz._id });
        if (questionCount === 30) {
          needsSeed = false;
          logger.info(`[PROD-SEED] Quiz found: ${practiceQuiz._id}`);
          logger.info(`[PROD-SEED] Question count: 30`);
          logger.info('[PROD-SEED] Production seed verification: PASS');
        } else {
          logger.warn(`[PROD-SEED] Quiz found but incomplete (${questionCount}/30 questions). Re-seeding...`);
        }
      } else {
        logger.info('[PROD-SEED] Quiz not found. Seeding...');
      }

      if (needsSeed) {
        const seedDigitalElectronicsQuiz = require('./scripts/seedDigitalElectronicsQuiz');
        await seedDigitalElectronicsQuiz();
        logger.info('[PROD-SEED] Production seed verification: PASS (Seeded successfully)');
      }
    } else {
      logger.info('Digital Electronics subject missing. Auto-seeding...');
      await seedDigitalElectronics();
    }

    // Auto-seed Analog Electronics if empty
    let analogSubject = await Subject.findOne({ name: 'Analog Electronics' });
    if (!analogSubject) {
      analogSubject = await Subject.findOne({ code: 'ECE-AE' });
    }
    if (analogSubject) {
      const analogCount = await Note.countDocuments({ subject: analogSubject._id });
      if (analogCount === 0) {
        logger.info('Auto-seeding Analog Electronics notes into production database...');
        const seedAnalogElectronics = require('./scripts/seedAnalogElectronics');
        await seedAnalogElectronics();
      }
    }
  } catch (error) {
    logger.error('[PROD-SEED] FATAL ERROR during initialization/seeding:', error);
    // Continue starting the server so we can at least serve traffic, but log loudly
  }

  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
