const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const { User } = require('../config/db');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey12345', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user._id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Request Password Reset Link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404);
      throw new Error('User not found with this email');
    }

    // Generate random token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Save token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    // Reset Link URL
    const resetUrl = `${req.protocol}://${req.get('host').replace('5000', '5173')}/reset-password/${resetToken}`;

    // Send email via nodemailer
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.warn('[RESET PASSWORD WARNING] EMAIL_USER or EMAIL_PASS not configured in .env. Logging reset link details below:');
      console.log(`
      --------------------------------------------------
      [RESET PASSWORD LINK FOR: ${user.email}]
      URL: ${resetUrl}
      --------------------------------------------------
      `);
      return res.json({
        message: 'Password reset link generated. Since email service is not configured, please check the server terminal console log for the link.',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"Apex Academy Portal" <${emailUser}>`,
      to: user.email,
      subject: 'Apex Academy - Password Reset Request',
      text: `Hello ${user.name},\n\nYou requested a password reset. Please click on the link below to set a new password:\n\n${resetUrl}\n\nThis link is valid for 1 hour.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nApex Academy System`,
      html: `
        <h3>Password Reset Request</h3>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Please click on the link below to set a new password:</p>
        <p><a href="${resetUrl}" target="_blank" style="padding: 10px 20px; background-color: #0e91eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a></p>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link is valid for 1 hour.</p>
        <br/>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired password reset token');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password updated successfully! You can now log in.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
};
