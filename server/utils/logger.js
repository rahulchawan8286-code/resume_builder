const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    // Write all errors to error.log
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    // Write all logs to access.log
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/access.log') 
    })
  ]
});

// If we're not in production, also log to the console with custom formatting
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, stack, reqId }) => {
        let msg = `${timestamp} ${level}: ${reqId ? `[ReqID: ${reqId}] ` : ''}${message}`;
        if (stack) {
          msg += `\n${stack}`;
        }
        return msg;
      })
    )
  }));
}

// Create a stream object with a write function that will be used by Morgan
logger.stream = {
  write: function(message, encoding) {
    // Morgan adds a newline character at the end, so we remove it
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

module.exports = logger;
