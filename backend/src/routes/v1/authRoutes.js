const express = require('express');
const authController = require('../../controllers/authController');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

// User Auth
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);

// Owner Auth
router.post('/owner/register', authController.registerOwner);
router.post('/owner/login', authController.loginOwner);

// Common Auth
router.post('/verify-otp', authController.verifyOtp);
router.post('/forgot-password', authController.forgotPassword);

// Profile Management (Protected)
router.get('/profile', authenticate, authController.getProfile);
router.patch('/profile', authenticate, authController.updateProfile);

module.exports = router;
