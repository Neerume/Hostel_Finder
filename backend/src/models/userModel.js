const pool = require('../config/database');

const getUserByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
        [email]
    );
    return rows[0];
};

const getUserById = async (id) => {
    const [rows] = await pool.query(
        'SELECT user_id as id, fullname, email, is_verified, created_at FROM users WHERE user_id = ? AND deleted_at IS NULL',
        [id]
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

const updateUser = async (id, updateData) => {
    const fields = [];
    const values = [];

    if (updateData.fullname) {
        fields.push('fullname = ?');
        values.push(updateData.fullname);
    }
    if (updateData.email) {
        fields.push('email = ?');
        values.push(updateData.email);
    }
    if (updateData.password_hash) {
        fields.push('password_hash = ?');
        values.push(updateData.password_hash);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const [result] = await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
        values
    );
    return result;
};

module.exports = {
    getUserByEmail,
    getUserById,
    createUser,
    savePasswordResetOtp,
    updatePassword,
    updateUser
};
