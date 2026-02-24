const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const globalErrorHandler = require('./middlewares/error.middleware');
const AppError = require('./utils/appError');
const routes = require('./routes/v1');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// v1 API routes
app.use('/api/v1', routes);

// Handle unknown route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handling
app.use(globalErrorHandler);

module.exports = app;
