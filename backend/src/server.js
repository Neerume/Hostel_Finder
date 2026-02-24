const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const pool = require('./config/database');

// Test database connection before starting the server
pool.getConnection()
    .then((connection) => {
        logger.info('Connected to MySQL database!');
        connection.release(); // release connection back to the pool

        const server = app.listen(env.port, () => {
            logger.info(`Server is running on port ${env.port} in ${env.nodeEnv} mode.`);
        });

        // Handle unhandled rejections
        process.on('unhandledRejection', (err) => {
            logger.error(`UNHANDLED REJECTION! 💥 Shutting down... ${err.name}: ${err.message}`);
            server.close(() => {
                process.exit(1);
            });
        });
    })
    .catch((err) => {
        logger.error(`Unable to connect to the database: ${err.message}`);
        process.exit(1);
    });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error(`UNCAUGHT EXCEPTION! 💥 Shutting down... ${err.name}: ${err.message}`, err.stack);
    process.exit(1);
});
