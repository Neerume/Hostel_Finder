const pool = require('../config/database');

const createHostel = async (hostelData) => {
    const {
        owner_id, name, description, address, hostel_email, phone_number,
        rules, number_of_rooms, available_rooms, price, amenities,
        hostel_image_url, latitude, longitude
    } = hostelData;

    const [result] = await pool.query(
        `INSERT INTO hostels 
         (owner_id, name, description, address, hostel_email, phone_number, rules,
          number_of_rooms, available_rooms, price, amenities, hostel_image_url, latitude, longitude) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            owner_id, name, description, address, hostel_email, phone_number, rules,
            number_of_rooms, available_rooms, price,
            JSON.stringify(amenities),
            JSON.stringify(hostel_image_url), // store array of image URLs as JSON
            latitude || null,
            longitude || null
        ]
    );
    return result;
};

// Helper to parse JSON columns on a hostel row
const parseHostelRow = (row) => {
    if (row.amenities && typeof row.amenities === 'string') {
        try { row.amenities = JSON.parse(row.amenities); } catch (e) { row.amenities = []; }
    } else if (!row.amenities) {
        row.amenities = [];
    }
    if (row.hostel_image_url && typeof row.hostel_image_url === 'string') {
        try { row.hostel_image_url = JSON.parse(row.hostel_image_url); } catch (e) { row.hostel_image_url = []; }
    } else if (!row.hostel_image_url) {
        row.hostel_image_url = [];
    }
    return row;
};

const getHostelById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM hostels WHERE hostel_id = ? AND deleted_at IS NULL',
        [id]
    );
    return rows.length > 0 ? parseHostelRow(rows[0]) : null;
};

const getHostelsByOwnerId = async (owner_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM hostels WHERE owner_id = ? AND deleted_at IS NULL',
        [owner_id]
    );
    return rows.map(parseHostelRow);
};

const getAllHostels = async () => {
    const [rows] = await pool.query('SELECT * FROM hostels WHERE deleted_at IS NULL');
    return rows.map(parseHostelRow);
};

module.exports = {
    createHostel,
    getHostelById,
    getHostelsByOwnerId,
    getAllHostels
};
