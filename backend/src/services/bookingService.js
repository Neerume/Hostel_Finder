const bookingModel = require('../models/bookingModel');
const AppError = require('../utils/appError');
const emailService = require('./emailService');

const createBooking = async (userId, bookingData) => {
    return await bookingModel.createBooking({ ...bookingData, user_id: userId });
};

const getUserBookings = async (userId) => {
    return await bookingModel.getBookingsByUserId(userId);
};

const getOwnerBookings = async (ownerId) => {
    return await bookingModel.getBookingsByOwnerId(ownerId);
};

const updateStatus = async (bookingId, ownerId, status) => {
    const booking = await bookingModel.getBookingById(bookingId);
    if (!booking) {
        throw new AppError('Booking not found', 404);
    }

    // Status update logic
    await bookingModel.updateBookingStatus(bookingId, status);

    // If approved/rejected, we should notify the user via email if email service is set up
    // Looking at current project, emailService exists but might be mock or needing config.
    try {
        if (status === 'approved') {
            await emailService.sendEmail({
                to: booking.user_email,
                subject: 'Booking Approved!',
                text: `Congratulations! Your booking for ${booking.hostel_name} has been approved.`
            });
        } else if (status === 'rejected') {
            await emailService.sendEmail({
                to: booking.user_email,
                subject: 'Booking Status Update',
                text: `We regret to inform you that your booking for ${booking.hostel_name} was not approved.`
            });
        }
    } catch (err) {
        console.error('Failed to send notification email:', err.message);
    }

    return booking;
};

module.exports = {
    createBooking,
    getUserBookings,
    getOwnerBookings,
    updateStatus
};
