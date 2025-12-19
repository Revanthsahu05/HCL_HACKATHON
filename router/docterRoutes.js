const express = require('express');
const router = express.Router();
const { getDoctorSlots, getDoctorHistory, updateAppointmentStatus } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Doctor viewing their own slots
router.get('/slots', protect, authorize('DOCTOR'), getDoctorSlots);

// Doctor viewing history
router.get('/appointments/history', protect, authorize('DOCTOR'), getDoctorHistory);

// Update appointment status
router.put('/appointments/:id/status', protect, authorize('DOCTOR'), updateAppointmentStatus);

module.exports = router;