const bookingService = require('../services/bookingService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createBooking = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Please login to book', 401));
    }

    const { hostel_id, booking_type, booking_date } = req.body;

    // Basic validation
    if (!hostel_id || !booking_type || !booking_date) {
        return next(new AppError('Missing booking details', 400));
    }

    const newBooking = await bookingService.createBooking(req.user.id, {
        hostel_id,
        booking_type,
        booking_date
    });

    res.status(201).json({
        status: 'success',
        data: {
            booking: newBooking
        }
    });
});

const getMyBookings = catchAsync(async (req, res, next) => {
    // If user is 'user' (student), fetch their bookings
    // If user is 'owner', fetch bookings for their hostels
    let bookings;
    if (req.user.role === 'owner') {
        bookings = await bookingService.getOwnerBookings(req.user.id);
    } else {
        bookings = await bookingService.getUserBookings(req.user.id);
    }

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
});

const updateBookingStatus = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'owner') {
        return next(new AppError('Only owners can approve/reject bookings', 403));
    }

    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
        return next(new AppError('Invalid status', 400));
    }

    await bookingService.updateStatus(id, req.user.id, status);

    res.status(200).json({
        status: 'success',
        message: `Booking ${status} successfully`
    });
});

module.exports = {
    createBooking,
    getMyBookings,
    updateBookingStatus
};
