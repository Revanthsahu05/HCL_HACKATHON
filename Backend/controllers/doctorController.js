const Appointment = require('../models/Appointment');
const { TIME_SLOTS } = require('../utils/constants');

// @desc    Get slots for a doctor on a specific date
// @route   GET /api/doctor/slots?date=YYYY-MM-DD
// @access  Doctor (Own slots) or Patient (View specific doctor slots)
const getDoctorSlots = async (req, res) => {
    const { date } = req.query;
    const doctorId = req.params.doctorId || req.user.userId; // If param exists (Patient view), else auth user (Doctor view)

    if (!date) {
        return res.status(400).json({ message: 'Date is required' });
    }

    try {
        const appointments = await Appointment.find({
            doctorId,
            date,
        });

        // 2. Map formatted time slots
        const bookedSlots = appointments.map((appt) => appt.timeSlot);

        const slotStatus = TIME_SLOTS.map((slot) => ({
            timeSlot: slot,
            status: bookedSlots.includes(slot) ? 'BOOKED' : 'FREE',
        }));

        res.json(slotStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get doctor's appointment history (or today's queue)
// @route   GET /api/doctor/appointments/history
// @access  Doctor
const getDoctorHistory = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.user.userId })
            .populate('patientId', 'name email') // Populate patient details
            .sort({ date: -1, timeSlot: 1 });

        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update appointment status and notes
// @route   PUT /api/doctor/appointments/:id/status
// @access  Doctor
const updateAppointmentStatus = async (req, res) => {
    const { status, notes } = req.body; // Accept notes
    const { id } = req.params;

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Verify ownership
        if (appointment.doctorId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (status) appointment.status = status;
        if (notes !== undefined) appointment.notes = notes; // Update notes if provided

        await appointment.save();

        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const User = require('../models/User'); // Import User model

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public (or Protected)
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'DOCTOR' }).select('-password');
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDoctorSlots,
    getDoctorHistory,
    updateAppointmentStatus,
    getAllDoctors
};
