const express = require('express');
const hostelController = require('../../controllers/hostelController');
const authenticate = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

// ── Public routes ──────────────────────────────────────────────────────────
router.get('/', hostelController.getHostels);

// ── Protected routes (authenticate applied per-route, not as blanket middleware,
//    so the /:id wildcard below can still be public) ─────────────────────────
router.post('/add', authenticate, upload.array('images', 5), hostelController.createHostel);
router.get('/my-hostels', authenticate, hostelController.getMyHostels);

// ── Public wildcard – MUST be last so named routes above take priority ──────
router.get('/:id', hostelController.getHostelById);

module.exports = router;
