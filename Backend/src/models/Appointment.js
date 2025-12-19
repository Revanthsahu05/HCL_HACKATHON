const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    queueNumber: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['booked', 'in_progress', 'completed', 'absent', 'cancelled'],
        default: 'booked',
    },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
