const mongoose = require('mongoose');
const logger = require('../logger/winston');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    // Do not exit process in serverless environments
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};
module.exports = connectDB;
