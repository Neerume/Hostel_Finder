const hostelModel = require('../models/hostelModel');
const AppError = require('../utils/appError');

const addHostel = async (ownerId, hostelData) => {
    // Validate or manipulate data if necessary
    const newHostel = {
        ...hostelData,
        owner_id: ownerId,
        available_rooms: hostelData.available_rooms !== undefined ? hostelData.available_rooms : hostelData.number_of_rooms
    };

    const result = await hostelModel.createHostel(newHostel);
    return { hostel_id: result.insertId, ...newHostel };
};

const getHostelById = async (id) => {
    return await hostelModel.getHostelById(id);
};

const getHostelsForOwner = async (ownerId) => {
    return await hostelModel.getHostelsByOwnerId(ownerId);
};

const getAllHostels = async () => {
    return await hostelModel.getAllHostels();
};

module.exports = {
    addHostel,
    getHostelById,
    getHostelsForOwner,
    getAllHostels
};