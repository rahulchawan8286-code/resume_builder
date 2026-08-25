const mongoose = require('mongoose');

// Globally disable Mongoose buffering so requests fail fast if DB is not connected
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    if (process.env.DEVELOPMENT_MODE === 'true') {
      console.log('MongoDB connection skipped: Running in DEVELOPMENT_MODE');
      return;
    }

    if (!process.env.MONGO_URI) {
      console.error('FATAL: MONGO_URI is not defined in .env. Cannot start without a database.');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
