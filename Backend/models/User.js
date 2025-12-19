const mongoose = require('mongoose');
const { DOCTOR_SPECIALIZATIONS } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['PATIENT', 'DOCTOR'],
        default: 'PATIENT',
    },
    specialization: {
        type: String, // Only for doctors
        enum: DOCTOR_SPECIALIZATIONS,
    },
    experience: {
        type: Number, // Years of experience
    },
    fees: {
        type: Number,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
