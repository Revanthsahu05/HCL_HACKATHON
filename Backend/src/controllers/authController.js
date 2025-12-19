const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new patient
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'patient',
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register new doctor
// @route   POST /api/auth/register/doctor
// @access  Public
const registerDoctor = async (req, res) => {
    const { name, email, password, specialization } = req.body;

    try {
        const doctorExists = await Doctor.findOne({ email });

        if (doctorExists) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }

        const doctor = await Doctor.create({
            name,
            email,
            password,
            role: 'doctor',
            specialization,
        });

        if (doctor) {
            res.status(201).json({
                _id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                role: doctor.role,
                token: generateToken(doctor.id, doctor.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid doctor data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user or doctor
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check User first
        let user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        }

        // Check Doctor
        const doctor = await Doctor.findOne({ email });
        if (doctor && (await doctor.matchPassword(password))) {
            return res.json({
                _id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                role: doctor.role,
                token: generateToken(doctor.id, doctor.role),
            });
        }

        res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    registerDoctor,
    loginUser,
};
