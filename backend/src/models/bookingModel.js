const pool = require('../config/database');

const createBooking = async (bookingData) => {
    const { user_id, hostel_id, booking_type, booking_date } = bookingData;
    const [result] = await pool.query(
        `INSERT INTO bookings (user_id, hostel_id, booking_type, booking_date) 
         VALUES (?, ?, ?, ?)`,
        [user_id, hostel_id, booking_type, booking_date]
    );
    return result;
};

const getBookingsByUserId = async (userId) => {
    const [rows] = await pool.query(
        `SELECT b.*, h.name as hostel_name, h.address as hostel_address 
         FROM bookings b
         JOIN hostels h ON b.hostel_id = h.hostel_id
         WHERE b.user_id = ? AND b.deleted_at IS NULL
         ORDER BY b.created_at DESC`,
        [userId]
    );
    return rows;
};

const getBookingsByOwnerId = async (ownerId) => {
    const [rows] = await pool.query(
        `SELECT b.*, h.name as hostel_name, u.fullname as user_name, u.email as user_email
         FROM bookings b
         JOIN hostels h ON b.hostel_id = h.hostel_id
         JOIN users u ON b.user_id = u.user_id
         WHERE h.owner_id = ? AND b.deleted_at IS NULL
         ORDER BY b.created_at DESC`,
        [ownerId]
    );
    return rows;
};

const updateBookingStatus = async (bookingId, status) => {
    const [result] = await pool.query(
        `UPDATE bookings SET status = ? WHERE booking_id = ?`,
        [status, bookingId]
    );
    return result;
};

const getBookingById = async (bookingId) => {
    const [rows] = await pool.query(
        `SELECT b.*, u.fullname as user_name, u.email as user_email, h.name as hostel_name 
         FROM bookings b
         JOIN users u ON b.user_id = u.user_id
         JOIN hostels h ON b.hostel_id = h.hostel_id
         WHERE b.booking_id = ?`,
        [bookingId]
    );
    return rows[0];
};

module.exports = {
    createBooking,
    getBookingsByUserId,
    getBookingsByOwnerId,
    updateBookingStatus,
    getBookingById
};
