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

const requestPasswordReset = async (email) => {
    // Determine if it's a user or owner
    let account = await userModel.getUserByEmail(email);
    let type = 'user';

    if (!account) {
        account = await ownerModel.getOwnerByEmail(email);
        type = 'owner';
    }

    if (!account) {
        // Return without error to prevent email enumeration
        return;
    }

    // Generate random 8 character alphanumeric password
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    if (type === 'user') {
        await userModel.updatePassword(email, hashedPassword);
    } else {
        await ownerModel.updatePassword(email, hashedPassword);
    }

    await emailService.sendNewPasswordEmail(email, newPassword);
};

const getProfile = async (id, role) => {
    if (role === 'user') {
        const user = await userModel.getUserById(id);
        if (!user) throw new AppError('User not found', 404);
        return user;
    } else {
        const owner = await ownerModel.getOwnerById(id);
        if (!owner) throw new AppError('Owner not found', 404);
        return owner;
    }
};

const updateProfile = async (id, role, updateData) => {
    // 1. If password is being updated, hash it
    if (updateData.password) {
        updateData.password_hash = await bcrypt.hash(updateData.password, 12);
        delete updateData.password;
    }

    // 2. Perform update based on role
    if (role === 'user') {
        const result = await userModel.updateUser(id, updateData);
        if (!result) throw new AppError('Update failed', 400);
        return await userModel.getUserById(id);
    } else {
        const result = await ownerModel.updateOwner(id, updateData);
        if (!result) throw new AppError('Update failed', 400);
        return await ownerModel.getOwnerById(id);
    }
};

module.exports = {
    createUser,
    createOwner,
    authenticateUserEmailPassword,
    authenticateOwnerEmailPassword,
    requestPasswordReset,
    getProfile,
    updateProfile
};
