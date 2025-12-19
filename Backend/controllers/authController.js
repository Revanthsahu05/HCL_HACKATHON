const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
    return jwt.sign({ userId: id, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password, role, specialization, experience, fees } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please include all fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'PATIENT',
        specialization,
        experience,
        fees
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.age) user.age = req.body.age;
            if (req.body.illnessHistory) user.illnessHistory = req.body.illnessHistory;

            if (req.body.specialization) user.specialization = req.body.specialization;
            if (req.body.experience) user.experience = req.body.experience;
            if (req.body.isAvailable !== undefined) user.isAvailable = req.body.isAvailable;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                age: updatedUser.age,
                illnessHistory: updatedUser.illnessHistory,
                specialization: updatedUser.specialization,
                experience: updatedUser.experience,
                isAvailable: updatedUser.isAvailable,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
};
