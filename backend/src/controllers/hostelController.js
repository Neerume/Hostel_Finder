const hostelService = require('../services/hostelService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createHostel = catchAsync(async (req, res, next) => {
    // Determine the owner ID. req.user should be populated by auth middleware
    if (!req.user || req.user.role !== 'owner') {
        return next(new AppError('Only owners can add hostels!', 403));
    }

    let {
        name, description, address, hostel_email, phone_number,
        rules, number_of_rooms, available_rooms, price, amenities, latitude, longitude
    } = req.body;

    // Amenities could come as a stringified JSON if it's sent via FormData
    if (typeof amenities === 'string') {
        try {
            amenities = JSON.parse(amenities);
        } catch (e) {
            amenities = [amenities]; // fallback
        }
    }

    // Process uploaded images
    let hostel_image_url = [];
    if (req.files && req.files.length > 0) {
        hostel_image_url = req.files.map(file => `/uploads/${file.filename}`);
    }

    const hostelData = {
        name, description, address, hostel_email, phone_number,
        rules, number_of_rooms, available_rooms, price, amenities, hostel_image_url,
        latitude, longitude
    };

    const newHostel = await hostelService.addHostel(req.user.id, hostelData);

    res.status(201).json({
        status: 'success',
        data: {
            hostel: newHostel
        }
    });
});

const getHostelById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const hostel = await hostelService.getHostelById(id);
    if (!hostel) {
        return next(new AppError('Hostel not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { hostel }
    });
});

const getMyHostels = catchAsync(async (req, res, next) => {
    if (!req.user || req.user.role !== 'owner') {
        return next(new AppError('Only owners can view their hostels!', 403));
    }

    const hostels = await hostelService.getHostelsForOwner(req.user.id);

    res.status(200).json({
        status: 'success',
        results: hostels.length,
        data: { hostels }
    });
});

const getHostels = catchAsync(async (req, res, next) => {
    // This could have filters, search, etc later
    const hostels = await hostelService.getAllHostels();

    res.status(200).json({
        status: 'success',
        results: hostels.length,
        data: { hostels }
    });
});

module.exports = {
    createHostel,
    getHostelById,
    getMyHostels,
    getHostels
};
