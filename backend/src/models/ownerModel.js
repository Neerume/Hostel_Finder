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

module.exports = {
    getOwnerByEmail,
    createOwner
};
