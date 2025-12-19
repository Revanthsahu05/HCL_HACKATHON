const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { TIME_SLOTS } = require('../utils/constants');

const bookAppointment = async (req, res) => {
    const { doctorId, date, timeSlot } = req.body;
    const patientId = req.user.userId;

    if (!doctorId || !date || !timeSlot) {
        return res.status(400).json({ message: 'Please provide doctorId, date, and timeSlot' });
    }

    if (!TIME_SLOTS.includes(timeSlot)) {
        return res.status(400).json({ message: 'Invalid time slot' });
    }

    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];

    if (date < todayDate) {
        return res.status(400).json({ message: 'Cannot book in the past' });
    }

    if (date === todayDate) {
        const [startHour, startMinute] = timeSlot.split('-')[0].split(':').map(Number);
        const slotTime = new Date(today);
        slotTime.setHours(startHour, startMinute, 0, 0);

        if (slotTime < today) {
            return res.status(400).json({ message: 'This time slot has already passed' });
        }
    }

    try {
        const existingApptWithDoctor = await Appointment.findOne({
            patientId,
            doctorId,
            date
        });

        if (existingApptWithDoctor) {
            return res.status(400).json({ message: 'You already have an appointment with this doctor on this date.' });
        }

        const existingApptAtTime = await Appointment.findOne({
            patientId,
            date,
            timeSlot
        });

        if (existingApptAtTime) {
            return res.status(400).json({ message: 'You already have an appointment scheduled at this time.' });
        }

        const appointment = await Appointment.create({
            doctorId,
            patientId,
            date,
            timeSlot,
        });

        res.status(201).json(appointment);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Slot already booked' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyHistory = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.userId })
            .populate('doctorId', 'name email specialization')
            .sort({ date: -1, timeSlot: 1 });

        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];
        const currentHour = today.getHours();

        const updatedAppointments = await Promise.all(appointments.map(async (appt) => {
            if (appt.status === 'BOOKED') {
                let shouldComplete = false;

                if (appt.date < todayDate) {
                    shouldComplete = true;
                } else if (appt.date === todayDate) {
                    const endTimeStr = appt.timeSlot.split('-')[1];
                    const endHour = parseInt(endTimeStr.split(':')[0], 10);

                    if (currentHour >= endHour) {
                        shouldComplete = true;
                    }
                }

                if (shouldComplete) {
                    appt.status = 'COMPLETED';
                    await appt.save();
                }
            }
            return appt;
        }));

        res.json(updatedAppointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    bookAppointment,
    getMyHistory,
};
