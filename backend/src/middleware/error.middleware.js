const logger = require('../logger/winston');
const { errorResponse } = require('../utils/responseFormat');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });
  
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(val => val.message);
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  errorResponse(res, statusCode, message, errors);
};

const notFoundHandler = (req, res, next) => {
  errorResponse(res, 404, `Resource not found: ${req.originalUrl}`);
};

module.exports = { errorHandler, notFoundHandler };
