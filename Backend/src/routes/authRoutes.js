const express = require('express');
const router = express.Router();
const { registerUser, registerDoctor, loginUser } = require('../controllers/authController');

router.post('/register', registerUser); // Patient registration
router.post('/register/doctor', registerDoctor); // Doctor registration
router.post('/login', loginUser);

module.exports = router;
