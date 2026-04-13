const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
    });

    try {
      await sendVerificationEmail(user.email, verificationCode);
    } catch (emailError) {
      console.error('Email failed to send:', emailError.message);
      return res.status(201).json({
        success: true,
        message: 'Account created, but we couldn\'t send the verification email. Please contact support.',
        data: { userId: user._id },
        emailError: true
      });
    }

    res.status(201).json({
      success: true,
      message: 'Signup successful. Please check your email for verification code.',
      data: { userId: user._id },
    });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ 
      email, 
      verificationCode: code, 
      verificationCodeExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email first' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    await sendVerificationEmail(user.email, verificationCode);

    res.status(200).json({ success: true, message: 'New verification code sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
