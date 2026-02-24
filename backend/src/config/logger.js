// Simple console logger wrapper for standardizing logging.
// Could be replaced with Winston or Pino in production.

const logger = {
    info: (message) => {
        console.log(`[INFO] [${new Date().toISOString()}] ${message}`);
    },
    error: (message, meta = '') => {
        console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, meta);
    },
    warn: (message) => {
        console.warn(`[WARN] [${new Date().toISOString()}] ${message}`);
    },
};

module.exports = logger;
