const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user and generate an email verification token
        const user = new User({ name, email, password });

        // Generate an email verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Store the verification token and its expiration date
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = Date.now() + 3600000;

        await user.save();

        // Send email with the verification link
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        const emailSubject = 'Please verify your email address';
        const emailText = `Please verify your email by clicking the link: ${verificationUrl}`;
        const emailHtml = `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">Verify Email</a>`;

        await sendEmail(user.email, emailSubject, emailText, emailHtml);

        res.status(201).json({
            message: 'User registered successfully! Please check your email for verification.',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    // Check validation errors from middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email before logging in.' });
            }

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Verify email
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        // Mark the user's email as verified
        user.isVerified = true;
        user.emailVerificationToken = undefined; // Clear the token
        user.emailVerificationTokenExpiration = undefined; // Clear the expiration date

        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
