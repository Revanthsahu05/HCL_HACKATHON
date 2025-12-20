const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
    },
    timeSlot: {
        type: String, // e.g., "09:00-10:00"
        required: true,
    },
    status: {
        type: String,
        enum: ['BOOKED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ABSENT'],
        default: 'BOOKED'
    },
    notes: {
        type: String, // Doctor's notes/prescription
    }
}, {
    timestamps: true,
});

// Compound index to prevent double booking for the same doctor at the same time
appointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
