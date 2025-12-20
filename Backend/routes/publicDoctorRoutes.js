const express = require('express');
const router = express.Router();
const { getDoctorSlots, getAllDoctors } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

// Patient view of doctor slots
// Route: /api/doctors/:doctorId/slots
router.get('/:doctorId/slots', protect, getDoctorSlots);

// List all doctors
// Route: /api/doctors
router.get('/', protect, getAllDoctors);

module.exports = router;
