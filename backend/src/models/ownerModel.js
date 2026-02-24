const pool = require('../config/database');

const getOwnerByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM owners WHERE email = ? AND deleted_at IS NULL',
        [email]
    );
    return rows[0];
};

const createOwner = async (ownerData) => {
    const { fullname, email, password, otp_code, otp_expires_at } = ownerData;
    const [result] = await pool.query(
        `INSERT INTO owners (fullname, email, password_hash, otp_code, otp_expires_at)
         VALUES (?, ?, ?, ?, ?)`,
        [fullname, email, password, otp_code, otp_expires_at]
    );
    return result;
};

const savePasswordResetOtp = async (email, otp, expiresAt) => {
    const [result] = await pool.query(
        `UPDATE owners SET otp_code = ?, otp_expires_at = ? WHERE email = ?`,
        [otp, expiresAt, email]
    );
    return result;
};

const updatePassword = async (email, passwordHash) => {
    const [result] = await pool.query(
        `UPDATE owners SET password_hash = ? WHERE email = ?`,
        [passwordHash, email]
    );
    return result;
};

module.exports = {
    getOwnerByEmail,
    createOwner,
    savePasswordResetOtp,
    updatePassword
};
