const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to check database connectivity
const checkDatabaseConnection = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database connection unavailable');
  }
};

// Generate JWT Access Token (15 minutes)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generate JWT Refresh Token (7 days)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    checkDatabaseConnection();
    
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || user.photoURL,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'Database connection unavailable') {
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    checkDatabaseConnection();
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || user.photoURL,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.message === 'Database connection unavailable') {
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /auth/google
// @desc    Accept Google ID token, verify it, create/find user in MongoDB, return JWT access token + set refresh token in httpOnly cookie
// @access  Public
router.post('/google', async (req, res) => {
  try {
    checkDatabaseConnection();
    
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Update user info if needed
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (picture && user.picture !== picture) {
        user.picture = picture;
        updated = true;
      }
      if (picture && user.photoURL !== picture) {
        user.photoURL = picture;
        updated = true;
      }
      if (user.name !== name) {
        user.name = name;
        updated = true;
      }
      
      if (updated) {
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        googleId,
        email,
        name,
        picture: picture || '',
        photoURL: picture || ''
      });
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Google token verification error:', error);
    if (error.message === 'Database connection unavailable') {
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again later.' });
    }
    res.status(400).json({ message: 'Invalid Google token' });
  }
});

// @route   POST /auth/refresh
// @desc    Verify refresh token (from cookie), return new access token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    checkDatabaseConnection();

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || process.env.JWT_SECRET);
    
    // Find user and check if refresh token matches
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id);

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || user.photoURL,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    if (error.message === 'Database connection unavailable') {
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error during token refresh' });
  }
});

// @route   POST /auth/logout
// @desc    Clear refresh token (cookie + DB)
// @access  Public
router.post('/logout', async (req, res) => {
  try {
    checkDatabaseConnection();

    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Find user and clear refresh token from database
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    // Clear cookie even if there's an error
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  }
});

// @route   GET /profile
// @desc    Protected route that requires access token
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture || req.user.photoURL,
        isAdmin: req.user.isAdmin,
        registeredTournaments: req.user.registeredTournaments
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;