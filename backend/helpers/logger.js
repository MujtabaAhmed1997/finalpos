const winston = require('winston');
const path = require('path');

// Define custom log levels
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
        trace: 'gray'
    }
};

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
const fs = require('fs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create logger instance
const logger = winston.createLogger({
    levels: customLevels.levels,
    defaultMeta: { service: 'pos-system' },
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.metadata(),
        winston.format.json()
    ),
    transports: [
        // Error logs
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),

        // Combined logs (all levels)
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 10
        }),

        // Console output in development
        ...(process.env.NODE_ENV !== 'production' ? [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevels.colors }),
                    winston.format.printf(({ timestamp, level, message, ...meta }) => {
                        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
                        return `${timestamp} [${level}]: ${message} ${metaStr}`;
                    })
                )
            })
        ] : [])
    ]
});

// Middleware to log HTTP requests
const requestLogger = (req, res, next) => {
    // Skip logging for health checks or static files
    if (req.path === '/health' || req.path.startsWith('/static')) {
        return next();
    }

    const start = Date.now();
    
    // Log request (without sensitive data)
    logger.info('HTTP Request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        // Don't log authorization header or body with passwords
    });

    // Log response when it finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 400 ? 'warn' : 'info';

        logger.log(level, 'HTTP Response', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user?.userId || 'anonymous'
        });
    });

    next();
};

// Middleware to log database operations
const dbLogger = (operation, query, duration, error = null) => {
    const level = error ? 'error' : 'debug';
    logger.log(level, 'Database Operation', {
        operation,
        duration: `${duration}ms`,
        ...(error && { error: error.message })
    });
};

// Middleware to log authentication events
const authLogger = (event, details) => {
    logger.info('Auth Event', {
        event,
        timestamp: new Date().toISOString(),
        ...details
    });
};

// Middleware to log errors with context
const errorLogger = (error, context = {}) => {
    logger.error('Application Error', {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString()
    });
};

// Global error handler that logs before responding
const globalErrorHandler = (err, req, res, next) => {
    // Log the error
    errorLogger(err, {
        path: req.path,
        method: req.method,
        userId: req.user?.userId
    });

    // Send response (without exposing internals in production)
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message;

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = {
    logger,
    requestLogger,
    dbLogger,
    authLogger,
    errorLogger,
    globalErrorHandler,
    logsDir
};
