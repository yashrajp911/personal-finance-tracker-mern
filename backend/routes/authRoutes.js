const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');

// Validation for registration
const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Validation for login
const validateLogin = [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/verify-email', verifyEmail);

module.exports = router;
