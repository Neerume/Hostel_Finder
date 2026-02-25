const express = require('express');
const authRoutes = require('./authRoutes');
const hostelRoutes = require('./hostelRoutes');
const bookingRoutes = require('./bookingRoutes');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    { path: '/hostels', route: hostelRoutes },
    { path: '/bookings', route: bookingRoutes },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
