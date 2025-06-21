const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendEmail } = require('../services/EmailService');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, dan nama lengkap wajib diisi' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email sudah terdaftar' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      phone: phone || null,
      status: 'pending_payment'
    });

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Selamat Datang di StreamHib!',
        html: `
          <h2>Halo ${fullName}!</h2>
          <p>Terima kasih telah mendaftar di StreamHib.</p>
          <p>Silakan pilih paket dan lakukan pembayaran untuk mengaktifkan akun Anda.</p>
          <p>Tim StreamHib</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Silakan pilih paket dan lakukan pembayaran.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email dan password wajib diisi' 
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        subscription: user.subscription
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Logout berhasil' });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Tidak ada token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        subscription: user.subscription
      }
    });

  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
});

module.exports = router;