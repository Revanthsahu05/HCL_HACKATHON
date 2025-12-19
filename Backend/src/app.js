const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));

app.get('/', (req, res) => {
    res.send('Hospital Appointment System API is running');
});

module.exports = app;
