const express = require('express');
const router = express.Router();
const { bookAppointment, getMyHistory } = require('../controllers/appointmentController');
const { getDoctorSlots } = require('../controllers/doctorController'); // Reuse logic
const { protect, authorize } = require('../middleware/authMiddleware');

// Book appointment
router.post('/', protect, authorize('PATIENT'), bookAppointment);
router.get('/my', protect, authorize('PATIENT'), getMyHistory);
module.exports = router;
