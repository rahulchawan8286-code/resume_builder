const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to attach a unique Request ID to each incoming request
 * and include it in the response headers for traceability.
 */
const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

module.exports = requestId;
