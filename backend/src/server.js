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
    // Auto-seed in production if notes are completely empty
    const subject = await Subject.findOne({ name: 'Digital Electronics' });
    if (subject) {
      const count = await Note.countDocuments({ subject: subject._id });
      if (count === 0) {
        logger.info('Auto-seeding Digital Electronics notes into production database...');
        await seedDigitalElectronics();
      }
    } else {
      logger.info('Digital Electronics subject missing. Auto-seeding...');
      await seedDigitalElectronics();
    }
  } catch (error) {
    logger.error('Failed to auto-seed notes:', error);
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
