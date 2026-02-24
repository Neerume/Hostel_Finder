const pool = require('../config/database');

const getUserByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
        [email]
    );
    return rows[0];
};

const createUser = async (userData) => {
    const { fullname, email, password, otp_code, otp_expires_at } = userData;
    const [result] = await pool.query(
        `INSERT INTO users (fullname, email, password_hash, otp_code, otp_expires_at)
         VALUES (?, ?, ?, ?, ?)`,
        [fullname, email, password, otp_code, otp_expires_at]
    );
    return result;
};

const savePasswordResetOtp = async (email, otp, expiresAt) => {
    const [result] = await pool.query(
        `UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?`,
        [otp, expiresAt, email]
    );
    return result;
};

const updatePassword = async (email, passwordHash) => {
    const [result] = await pool.query(
        `UPDATE users SET password_hash = ? WHERE email = ?`,
        [passwordHash, email]
    );
    return result;
};

module.exports = {
    getUserByEmail,
    createUser,
    savePasswordResetOtp,
    updatePassword
};
