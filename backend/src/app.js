require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./logger/winston');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const connectDB = require('./config/database');

// Connect to Database for Serverless environments (e.g., Vercel)
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'secret'));
app.use(compression());

// Request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    database: 'Connected',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Load API routes
const apiRoutes = require('./routes/index');
app.use('/api/v1', apiRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;


