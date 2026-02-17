/**
 * Structured Logger for MentorLink
 * Uses Pino for high-performance JSON logging
 */

const pino = require('pino');

// Determine log level based on environment
const getLogLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  const levels = {
    production: 'info',
    staging: 'debug',
    development: 'debug',
    test: 'error',
  };
  return process.env.LOG_LEVEL || levels[env] || 'info';
};

// Create base logger configuration
const baseConfig = {
  level: getLogLevel(),
  base: {
    service: 'mentorlink-api',
    version: process.env.npm_package_version || '1.0.0',
    instance: process.env.INSTANCE_ID || 'default',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      host: bindings.hostname,
    }),
  },
  redact: {
    paths: [
      'password',
      'token',
      'authorization',
      'cookie',
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'otp',
      'secret',
      'apiKey',
      'apiSecret',
      '*.password',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
};

// Development: pretty print
// Production: JSON for log aggregation
const transport = process.env.NODE_ENV === 'production'
  ? undefined
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };

// Create logger instance
const logger = pino(
  transport ? { ...baseConfig, transport } : baseConfig
);

// Child loggers for different modules
const createModuleLogger = (moduleName) => {
  return logger.child({ module: moduleName });
};

// Request logger middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = req.requestId || req.headers['x-request-id'] || generateRequestId();

  // Attach logger to request
  req.log = logger.child({
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
  });

  // Log request start
  req.log.info({
    msg: 'Request started',
    userAgent: req.headers['user-agent'],
    contentLength: req.headers['content-length'],
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      msg: 'Request completed',
      statusCode: res.statusCode,
      duration,
      contentLength: res.getHeader('content-length'),
    };

    // Use appropriate log level based on status code
    if (res.statusCode >= 500) {
      req.log.error(logData);
    } else if (res.statusCode >= 400) {
      req.log.warn(logData);
    } else if (duration > 1000) {
      // Log slow requests
      req.log.warn({ ...logData, slow: true });
    } else {
      req.log.info(logData);
    }
  });

  next();
};

// Error logger
const logError = (error, context = {}) => {
  const errorData = {
    msg: error.message,
    name: error.name,
    stack: error.stack,
    code: error.code,
    ...context,
  };

  if (error.status >= 500 || !error.status) {
    logger.error(errorData);
  } else {
    logger.warn(errorData);
  }
};

// Audit logger for sensitive operations
const auditLogger = createModuleLogger('audit');

const logAudit = (action, data) => {
  auditLogger.info({
    msg: 'Audit event',
    action,
    ...data,
    timestamp: new Date().toISOString(),
  });
};

// Performance logger
const perfLogger = createModuleLogger('performance');

const logPerformance = (operation, duration, metadata = {}) => {
  const logData = {
    msg: 'Performance metric',
    operation,
    duration,
    ...metadata,
  };

  if (duration > 5000) {
    perfLogger.warn({ ...logData, slow: true });
  } else if (duration > 1000) {
    perfLogger.info({ ...logData, moderate: true });
  } else {
    perfLogger.debug(logData);
  }
};

// Generate request ID
const generateRequestId = () => {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

// Security event logger
const securityLogger = createModuleLogger('security');

const logSecurityEvent = (event, data) => {
  securityLogger.warn({
    msg: 'Security event',
    event,
    ...data,
    timestamp: new Date().toISOString(),
  });
};

// Database query logger
const dbLogger = createModuleLogger('database');

const logQuery = (operation, collection, duration, metadata = {}) => {
  const logData = {
    msg: 'Database operation',
    operation,
    collection,
    duration,
    ...metadata,
  };

  if (duration > 1000) {
    dbLogger.warn({ ...logData, slow: true });
  } else {
    dbLogger.debug(logData);
  }
};

// External service logger
const externalLogger = createModuleLogger('external');

const logExternalCall = (service, operation, duration, success, metadata = {}) => {
  externalLogger.info({
    msg: 'External service call',
    service,
    operation,
    duration,
    success,
    ...metadata,
  });
};

module.exports = {
  logger,
  createModuleLogger,
  requestLogger,
  logError,
  logAudit,
  logPerformance,
  logSecurityEvent,
  logQuery,
  logExternalCall,
  generateRequestId,
};
