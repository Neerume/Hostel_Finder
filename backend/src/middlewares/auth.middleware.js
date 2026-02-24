const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const env = require('../config/env');

const authenticate = (req, res, next) => {
    try {
        let token;

        // Extract token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        // Verify token (will throw error if expired or invalid)
        const decoded = jwt.verify(token, env.jwt.secret);

        // Attach user info to request object
        // Expected payload: { id, role, iat, exp }
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token has expired. Please refresh your token.', 401));
        }
        return next(new AppError('Invalid token. Please log in again.', 401));
    }
};

module.exports = authenticate;
