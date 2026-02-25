// routes/v1/bookingRoutes.js

const express = require('express');
const bookingController = require('../../controllers/bookingController');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(authenticate);

router.post('/request', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.patch('/:id/status', bookingController.updateBookingStatus);

module.exports = router;