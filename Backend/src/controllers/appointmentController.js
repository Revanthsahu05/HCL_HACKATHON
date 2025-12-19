const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor'); // Changed from User

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
    const { doctorId, appointmentDate } = req.body;

    try {
        // Validate doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(400).json({ message: 'Invalid doctor selected' });
        }

        // Assign queue number 
        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        const count = await Appointment.countDocuments({
            doctorId,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay }
        });

        const appointment = await Appointment.create({
            patientId: req.user.id,
            doctorId,
            appointmentDate,
            queueNumber: count + 1,
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my appointments
// @route   GET /api/appointments/my
// @access  Private (Patient)
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id })
            .populate('doctorId', 'name specialization');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Patient)
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.patientId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (appointment.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel completed appointment' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ message: 'Appointment cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
};
