const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const globalErrorHandler = require('./middlewares/error.middleware');
const AppError = require('./utils/appError');
const routes = require('./routes/v1');
const path = require('path');

const app = express();

// Set security HTTP headers
// We disable CSP and set crossOriginResourcePolicy to false so that
// the frontend (localhost:5173) can load images from the backend (localhost:5000).
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
}));

// Enable CORS
app.use(cors());

// Serve uploads folder
const uploadsPath = path.resolve(__dirname, '../uploads');
console.log('Serving uploads from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Debug logger for missing files in /uploads
app.use('/uploads', (req, res, next) => {
    console.log(`404 at /uploads: ${req.url}`);
    next();
});

// Parse JSON request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// v1 API routes
app.use('/api/v1', routes);

// Handle unknown route
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handling
app.use(globalErrorHandler);

module.exports = app;
