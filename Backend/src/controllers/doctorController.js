const Appointment = require('../models/Appointment');

// @desc    Get today's appointments for doctor
// @route   GET /api/doctor/appointments/today
// @access  Private (Doctor)
const getTodayQueue = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            doctorId: req.user.id,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' } // Optionally hide cancelled ones or show them
        })
            .sort({ queueNumber: 1 })
            .populate('patientId', 'name email');

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PATCH /api/doctor/appointments/:id/status
// @access  Private (Doctor)
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body; // 'in_progress', 'completed', 'absent'

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.doctorId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        appointment.status = status;
        await appointment.save();

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getTodayQueue,
    updateAppointmentStatus
};
