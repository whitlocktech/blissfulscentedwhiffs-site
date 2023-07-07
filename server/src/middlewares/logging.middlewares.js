const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');

const logsDirectory = path.join(__dirname, '..', '..', 'logs');
const accessLogPath = path.join(logsDirectory, 'access.log');
const errorLogPath = path.join(logsDirectory, 'error.log');
const consoleLogPath = path.join(logsDirectory, 'console.log');

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' });

// Create a logger instance with file transports for errors and console logs
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: errorLogPath, level: 'error' }),
    new winston.transports.File({ filename: consoleLogPath }),
  ],
});

// Wrapper function for console.log
const logToConsole = (...args) => {
  logger.info(...args);
};

// Wrapper function for console.error
const logErrorToConsole = (...args) => {
  logger.error(...args);
};

const loggingMiddlewares = (req, res, next) => {
  // Log HTTP requests to access.log
  morgan('combined', { stream: accessLogStream })(req, res, () => {
    // Log errors to error.log using Winston
    const originalSend = res.send;
    res.send = function (data) {
      const status = res.statusCode;
      const message = res.statusMessage || '';
      if (status >= 400) {
        logger.error(`[${status}] ${message} - ${req.method} ${req.originalUrl}`);
      }
      res.send = originalSend;
      return res.send(data);
    };
    next();
  });
};

// Override console.log and console.error
console.log = logToConsole;
console.error = logErrorToConsole;

module.exports = loggingMiddlewares;
