const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validator');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
});

router.post('/signup', validateSignup, authController.signup);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-code', authLimiter, authController.resendCode);

module.exports = router;
