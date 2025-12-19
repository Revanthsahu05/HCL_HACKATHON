const express = require('express');
const router = express.Router();
const { bookAppointment, getMyHistory } = require('../controllers/appointmentController');
const { getDoctorSlots } = require('../controllers/doctorController'); // Reuse logic
const { protect, authorize } = require('../middleware/authMiddleware');

// Book appointment
router.post('/', protect, authorize('PATIENT'), bookAppointment);

// Patient History
router.get('/my', protect, authorize('PATIENT'), getMyHistory);

// Patient viewing doctor slots
// GET /api/doctors/:doctorId/slots
// This technically isn't under /api/appointments, but for simplicity I can put it here or in index.js
// I'll create a separate 'doctors' route handler in index.js for this specific public/patient-facing path.

module.exports = router;