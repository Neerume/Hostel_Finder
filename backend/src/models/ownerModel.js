const pool = require('../config/database');

const getOwnerByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM owners WHERE email = ? AND deleted_at IS NULL',
        [email]
    );
    return rows[0];
};

const getOwnerById = async (id) => {
    const [rows] = await pool.query(
        'SELECT owner_id as id, fullname, email, is_verified, created_at FROM owners WHERE owner_id = ? AND deleted_at IS NULL',
        [id]
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

const updateOwner = async (id, updateData) => {
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
        `UPDATE owners SET ${fields.join(', ')} WHERE owner_id = ?`,
        values
    );
    return result;
};

module.exports = {
    getOwnerByEmail,
    getOwnerById,
    createOwner,
    savePasswordResetOtp,
    updatePassword,
    updateOwner
};
