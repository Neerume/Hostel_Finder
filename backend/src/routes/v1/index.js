const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    // Placeholders for other routes
    // { path: '/users', route: userRoutes },
    // { path: '/owners', route: ownerRoutes },
    // { path: '/hostels', route: hostelRoutes },
    // { path: '/bookings', route: bookingRoutes },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
