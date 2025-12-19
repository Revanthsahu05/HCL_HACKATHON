const express = require('express');
const router = express.Router();
const { bookAppointment, getMyAppointments, cancelAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
