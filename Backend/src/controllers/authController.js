const jwt = require('jsonwebtoken');

// Mock Database
const users = [
    {
        id: 'doc1',
        name: 'Dr. House',
        email: 'doctor@hospital.com',
        password: 'password123',
        role: 'doctor',
        specialization: 'Cardiology'
    },
    {
        id: 'pat1',
        name: 'Alice Smith',
        email: 'alice@test.com',
        password: 'password123',
        role: 'patient',
        age: 29,
        gender: 'Female',
        illnessHistory: 'Chronic Migraine, Nausea'
    }
];

const register = (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = users.find(u => u.email === email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = { id: Date.now().toString(), name, email, password, role: role || 'patient' };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
};

const login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, user });
};

module.exports = { register, login };
