const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { generateAuthTokens } = require('../utils/tokenUtils');

const registerUser = catchAsync(async (req, res, next) => {
    // 1. Verify input (Joi validation usually happens in a middleware before this, keeping it simple here)
    const { fullname, email, password } = req.body;

    // 2. Call service to register
    const user = await authService.createUser({ fullname, email, password });

    // 3. Send Response
    res.status(201).json({
        status: 'success',
        message: 'Registration successful! Please check your email for the OTP.',
        data: {
            user_id: user.user_id,
            email: user.email,
        }
    });
});

const loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Authenticate user
    const user = await authService.authenticateUserEmailPassword(email, password);

    // 2. Generate Tokens
    const tokens = generateAuthTokens({ id: user.user_id, role: 'user' });

    res.status(200).json({
        status: 'success',
        data: {
            user: { id: user.user_id, fullname: user.fullname, email: user.email },
            tokens
        }
    });
});

const registerOwner = catchAsync(async (req, res, next) => {
    const { fullname, email, password } = req.body;

    const owner = await authService.createOwner({ fullname, email, password });

    res.status(201).json({
        status: 'success',
        message: 'Owner registration successful! Please check your email for the OTP.',
        data: {
            owner_id: owner.owner_id,
            email: owner.email,
        }
    });
});

const loginOwner = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const owner = await authService.authenticateOwnerEmailPassword(email, password);

    const tokens = generateAuthTokens({ id: owner.owner_id, role: 'owner' });

    res.status(200).json({
        status: 'success',
        data: {
            owner: { id: owner.owner_id, fullname: owner.fullname, email: owner.email },
            tokens
        }
    });
});

const verifyOtp = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'OTP verified successfully (placeholder implementation)'
    });
});

const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Please provide an email address.', 400));
    }

    await authService.requestPasswordReset(email);

    res.status(200).json({
        status: 'success',
        message: 'Password reset instructions sent to your email.'
    });
});

module.exports = {
    registerUser,
    loginUser,
    registerOwner,
    loginOwner,
    verifyOtp,
    forgotPassword
};
