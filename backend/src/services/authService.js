const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const ownerModel = require('../models/ownerModel');
const AppError = require('../utils/appError');
const emailService = require('./emailService');

const createUser = async (userData) => {
    if (await userModel.getUserByEmail(userData.email)) {
        throw new AppError('Email already in use', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    userData.password = hashedPassword;

    const result = await userModel.createUser({
        ...userData,
        otp_code: otp,
        otp_expires_at
    });

    // Send email with OTP here
    await emailService.sendOTP(userData.email, otp);

    return { user_id: result.insertId, email: userData.email };
};

const createOwner = async (ownerData) => {
    if (await ownerModel.getOwnerByEmail(ownerData.email)) {
        throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(ownerData.password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    ownerData.password = hashedPassword;

    const result = await ownerModel.createOwner({
        ...ownerData,
        otp_code: otp,
        otp_expires_at
    });

    await emailService.sendOTP(ownerData.email, otp);

    return { owner_id: result.insertId, email: ownerData.email };
};

const authenticateUserEmailPassword = async (email, password) => {
    const user = await userModel.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new AppError('Incorrect email or password', 401);
    }

    // Enforce OTP verification if needed
    // if (!user.is_verified) {
    //     throw new AppError('Please verify your email first', 401);
    // }

    return user;
};

const authenticateOwnerEmailPassword = async (email, password) => {
    const owner = await ownerModel.getOwnerByEmail(email);
    if (!owner || !(await bcrypt.compare(password, owner.password_hash))) {
        throw new AppError('Incorrect email or password', 401);
    }
    return owner;
};

module.exports = {
    createUser,
    createOwner,
    authenticateUserEmailPassword,
    authenticateOwnerEmailPassword
};
