const express = require('express');
const router = express.Router();
const { getTodayQueue, updateAppointmentStatus } = require('../controllers/doctorController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/today', protect, authorize('doctor'), getTodayQueue);
router.patch('/:id/status', protect, authorize('doctor'), updateAppointmentStatus);

module.exports = router;
