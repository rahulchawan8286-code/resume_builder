const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Custom Modules
const logger = require('./utils/logger');
const formatResponse = require('./utils/responseFormatter');
const errorHandler = require('./middleware/error');
const requestId = require('./middleware/requestId');

// Load env vars
dotenv.config();

const app = express();

// --- 1. Request ID Middleware ---
app.use(requestId);

// --- 2. Security Middleware ---
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// --- 3. Body Parsers & Compression ---
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// --- 4. Logging Middleware ---
app.use(morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms - ReqID: :req[x-request-id]', { stream: logger.stream }));

// --- 5. Swagger API Documentation ---
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- 6. Health Check Endpoints ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server running' });
});
app.get('/api/version', (req, res) => {
  res.status(200).json(formatResponse(true, 'API Version', { version: '1.0.0' }));
});

// --- 7. API v1 Routes ---
const authRoutes    = require('./routes/auth');
const resumeRoutes  = require('./routes/resumes');
const aiRoutes      = require('./routes/ai');
const pdfRoutes     = require('./routes/pdf');
const uploadRoutes  = require('./routes/upload');
const userRoutes    = require('./routes/users'); // Next step

app.use('/api/v1/auth',    authRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/ai',      aiRoutes);
app.use('/api/v1/pdf',     pdfRoutes);
app.use('/api/v1/upload',  uploadRoutes);
app.use('/api/v1/users',   userRoutes);

// --- 8. Centralized Error Handling ---
app.use(errorHandler);

module.exports = app;
