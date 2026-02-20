const User = require('../models/User');
const AdminSession = require('../models/AdminSession');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fileDb = require('../utils/fileDb');

const USE_FILE_DB = String(process.env.USE_FILE_DB || 'false').toLowerCase() === 'true';

// Helpers for file DB mode
const fileDbGetUserByEmail = (email) => fileDb.findUserByEmail(email);
const fileDbGetUserByUsername = (username) => fileDb.findUserByUsername(username);
const fileDbSaveUser = async (user) => fileDb.upsertUser(user);

// Generate a cryptographically strong 6-digit numeric OTP
const generateOTP = () => {
  let otp = '';
  for (let i = 0; i < 6; i += 1) {
    otp += String(crypto.randomInt(0, 10));
  }
  return otp;
};

// Gmail SMTP transporter - works on AWS (port 587 not blocked unlike Render free tier)
// Required env vars: EMAIL_USER, EMAIL_PASS (Gmail App Password - 16 chars no spaces)
let cachedTransporter = null;
const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  const emailUser = (process.env.EMAIL_USER || '').trim();
  const emailPass = (process.env.EMAIL_PASS || '').trim();

  console.log(`[SMTP] EMAIL_USER="${emailUser}" (${emailUser.length} chars), EMAIL_PASS length=${emailPass.length}`);

  if (!emailUser || !emailPass) {
    throw new Error('EMAIL_USER or EMAIL_PASS environment variable is missing');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: emailUser, pass: emailPass },
    tls: { rejectUnauthorized: false },
  });

  try {
    await transporter.verify();
    console.log('[SMTP] Gmail transporter verified successfully');
    cachedTransporter = transporter;
  } catch (err) {
    console.warn('[SMTP] Transporter verify failed:', err?.message);
    throw err;
  }

  return cachedTransporter;
};

// Send OTP email
const sendOTP = async (email, otp) => {
  const appName = process.env.APP_NAME || 'MentorLink';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:16px;color:#111">
      <h2 style="margin:0 0 12px 0;font-weight:700">${appName} Verification</h2>
      <p style="margin:0 0 12px 0;color:#444">Use the following OTP to complete your registration:</p>
      <div style="font-size:32px;letter-spacing:8px;font-weight:700;background:#f4f6f8;border:1px solid #e5e7eb;border-radius:8px;padding:16px;text-align:center;color:#111">${otp}</div>
      <p style="margin:12px 0 0 0;color:#666">This code expires in 5 minutes.</p>
      <p style="margin:8px 0 0 0;color:#888;font-size:12px">If you did not request this, ignore this email.</p>
    </div>
  `;

  try {
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: `MentorLink <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${appName} - Your Verification Code`,
      html,
    });
    console.log(`[OTP] Email sent to ${email}`);
  } catch (err) {
    cachedTransporter = null;
    console.error('[OTP] Failed to send email:', err?.message);
    console.warn(`[OTP-FALLBACK] OTP for ${email} = ${otp}`);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

// In-memory store for pending signups (before OTP verification)
// Key: email, Value: { userData, otp, otpExpires }
const pendingSignups = new Map();

// Clean up expired pending signups every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of pendingSignups.entries()) {
    if (data.otpExpires < now) {
      pendingSignups.delete(email);
    }
  }
}, 5 * 60 * 1000);

// @desc    Register user (stores pending signup, does NOT create user in DB)
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, username, email, bio, gender, role, password } = req.body;

  try {
    // Check if email/username already exist in DB
    if (USE_FILE_DB) {
      const emailExists = fileDbGetUserByEmail(email);
      const usernameExists = fileDbGetUserByUsername(username);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already registered. Please login or use a different email.' });
      }
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already taken. Please choose a different username.' });
      }
    } else {
      const emailExists = await User.findOne({ email });
      const usernameExists = await User.findOne({ username });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already registered. Please login or use a different email.' });
      }
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already taken. Please choose a different username.' });
      }
    }

    // Generate OTP and store signup data in memory (NOT in DB)
    const otp = generateOTP();
    pendingSignups.set(email, {
      userData: { name, username, email, bio, gender, role, password },
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Send OTP email
    let emailSent = true;
    try {
      await sendOTP(email, otp);
    } catch (emailErr) {
      console.error('OTP email failed during signup:', emailErr?.message);
      emailSent = false;
    }

    return res.status(201).json({
      message: emailSent
        ? 'OTP sent to your email. Please verify to complete registration.'
        : 'Registration saved. OTP email failed - please use Resend OTP.',
      emailSent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and create user in DB
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // First check pending signups (new registration flow)
    const pending = pendingSignups.get(email);
    if (pending) {
      if (pending.otp !== otp || pending.otpExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      // OTP verified - NOW create the user in DB
      const { name, username, email: userEmail, bio, gender, role, password } = pending.userData;

      let userId;
      let userName = name;
      let userRole = role;

      if (USE_FILE_DB) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = {
          id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(12).toString('hex'),
          name, username, email: userEmail, bio, gender, role,
          password: hashedPassword,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await fileDbSaveUser(user);
        userId = user.id;
      } else {
        const user = await User.create({
          name, username, email: userEmail, bio, gender, role, password,
          isVerified: true,
        });
        userId = user._id;
      }

      // Remove from pending signups
      pendingSignups.delete(email);

      const token = jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.json({
        message: 'OTP verified successfully',
        token,
        user: { id: userId, name: userName, email: userEmail, role: userRole },
      });
    }

    // Fallback: check existing users in DB (for login OTP flow)
    let user;
    if (USE_FILE_DB) {
      user = fileDbGetUserByEmail(email);
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: 'No pending registration found. Please sign up first.' });
    }

    const userOtp = user.otp;
    const userOtpExpires = user.otpExpires;
    if (userOtp !== otp || userOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (USE_FILE_DB) {
      user.isVerified = true;
      delete user.otp;
      delete user.otpExpires;
      user.updatedAt = new Date().toISOString();
      await fileDbSaveUser(user);

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.json({
        message: 'OTP verified successfully',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Resend OTP for signup verification
// @route   POST /api/users/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check pending signups first (new flow)
    const pending = pendingSignups.get(email);
    if (pending) {
      const otp = generateOTP();
      pending.otp = otp;
      pending.otpExpires = Date.now() + 5 * 60 * 1000;
      await sendOTP(email, otp);
      return res.json({ message: 'OTP resent to your email.' });
    }

    return res.status(400).json({ message: 'No pending registration found. Please sign up first.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (USE_FILE_DB) {
      const user = fileDbGetUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      // If user is an admin, create session tracking
      if (user.role === 'admin') {
        try {
          await AdminSession.createSession(user._id, token, req);
        } catch (sessionError) {
          console.error('Error creating admin session:', sessionError);
          // Continue even if session creation fails
        }
      }

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP for login
// @route   POST /api/users/send-login-otp
// @access  Public
const sendLoginOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (USE_FILE_DB) {
      const user = fileDbGetUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000;
      user.updatedAt = new Date().toISOString();
      await fileDbSaveUser(user);
      await sendOTP(email, otp);
      return res.json({ message: 'OTP sent to your email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTP(email, otp);

    return res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Login with OTP
// @route   POST /api/users/login-otp
// @access  Public
const loginWithOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (USE_FILE_DB) {
      const user = fileDbGetUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      delete user.otp;
      delete user.otpExpires;
      user.updatedAt = new Date().toISOString();
      await fileDbSaveUser(user);

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/upload-profile-picture
// @access  Private
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.cloudinaryResult) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const userId = req.user._id;
    const imageUrl = req.cloudinaryResult.secure_url;

    if (USE_FILE_DB) {
      const user = fileDb.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.profileImage = imageUrl;
      user.updatedAt = new Date().toISOString();
      await fileDbSaveUser(user);

      return res.json({
        message: 'Profile picture uploaded successfully',
        profileImage: imageUrl,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profileImage = imageUrl;
    await user.save();

    return res.json({
      message: 'Profile picture uploaded successfully',
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Soft delete user account (recoverable for 30 days)
// @route   DELETE /api/users/account
// @access  Private
const softDeleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be deleted this way' });
    }

    // Set soft delete fields
    const deletedAt = new Date();
    const scheduledPermanentDeletion = new Date(deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    user.isDeleted = true;
    user.deletedAt = deletedAt;
    user.deletionReason = reason || 'User requested account deletion';
    user.scheduledPermanentDeletion = scheduledPermanentDeletion;
    user.isVerified = false; // Prevent login

    await user.save();

    res.json({
      message: 'Account marked for deletion. It will be permanently deleted after 30 days. Contact admin to recover.',
      deletedAt,
      scheduledPermanentDeletion,
    });
  } catch (error) {
    console.error('Error in softDeleteAccount:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  authUser,
  sendLoginOTP,
  loginWithOTP,
  uploadProfilePicture,
  softDeleteAccount,
};
