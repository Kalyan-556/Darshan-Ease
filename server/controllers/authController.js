const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');

const ACCESS_SECRET = process.env.JWT_SECRET || 'darshanease_jwt_secret_key_987654321_abc';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'darshanease_jwt_refresh_secret_key_123456789_xyz';

const generateTokens = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'USER'
    });

    // Send welcome email simulation
    await sendEmail({
      to: email,
      subject: 'Welcome to DarshanEase!',
      html: `<h3>Dear ${name},</h3><p>Thank you for registering on DarshanEase. Start planning your temple darshan today!</p>`
    });

    const tokens = generateTokens(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        profileImage: newUser.profileImage,
        address: newUser.address
      },
      ...tokens
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const tokens = generateTokens(user);

    // If rememberMe is checked, adjust token expiration or return flag
    const responsePayload = {
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        address: user.address
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };

    res.json(responsePayload);
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token is required.' });
    }

    jwt.verify(token, REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired refresh token.' });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const newTokens = generateTokens(user);
      res.json({
        success: true,
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User with this email does not exist.' });
    }

    // Mock reset token
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    
    // Write reset code details in user model in simulated way (in memory or dynamic save)
    // For Mongoose or Mock DB, let's just update the profile with a resetCode field
    await User.findByIdAndUpdate(user._id, { address: user.address + ` || RESET:${resetCode}` });

    await sendEmail({
      to: email,
      subject: 'DarshanEase Password Reset Request',
      html: `<h3>Password Reset Code</h3><p>Your password reset code is: <strong>${resetCode}</strong>. Use this code to reset your account password.</p>`
    });

    res.json({ success: true, message: 'Password reset code sent to your email.' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if resetCode matches what is in user address field
    const addressStr = user.address || '';
    if (!addressStr.includes(`RESET:${resetCode}`) || !resetCode) {
      return res.status(400).json({ success: false, message: 'Invalid reset code.' });
    }

    // Clean up reset code from address field
    const cleanAddress = addressStr.split(' || RESET:')[0];

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      address: cleanAddress
    });

    res.json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        address: user.address
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    let updateFields = { name, phone, address };

    // Attach profile picture if uploaded
    if (req.file) {
      updateFields.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage || updateFields.profileImage || '',
        address: updatedUser.address
      }
    });
  } catch (err) {
    next(err);
  }
};
