const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

/**
 * Check if MongoDB connection is established
 */
const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database is offline. Please ensure MongoDB is running or configure MONGO_URI in .env.'
    });
    return false;
  }
  return true;
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  if (!checkDbConnection(res)) return;
  try {
    const { name, username, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, username, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // 2. Check for duplicate email
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.'
      });
    }

    // 3. Check for duplicate username
    const existingUsername = await User.findOne({ username: username.toLowerCase().trim() });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken. Please choose another.'
      });
    }

    // 4. Create user (password will be hashed automatically by pre-save hook)
    const user = await User.create({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar: name.trim().slice(0, 2).toUpperCase()
    });

    // 5. Generate JWT token with role
    const token = generateToken(user._id, user.role, user.username);

    // 6. Return response without password
    res.status(201).json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  if (!checkDbConnection(res)) return;
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    const loginIdentifier = (email || req.body.username || '').toLowerCase().trim();
    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/username and password.'
      });
    }

    // 2. Find user by email OR username and explicitly select password
    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password.'
      });
    }

    // 3. Compare password with hashed password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password.'
      });
    }

    // Check if user account has been suspended
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by a Realm Guardian. Access denied.'
      });
    }

    // 4. Generate JWT token with role
    const token = generateToken(user._id, user.role, user.username);

    // 5. Return safe user data & token
    res.status(200).json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user was attached by protect middleware and password was excluded
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (name, bio, avatar)
 * @route   PUT /api/auth/profile
 * @access  Private (Protected by authMiddleware)
 */
const updateProfile = async (req, res, next) => {
  if (!checkDbConnection(res)) return;
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name !== undefined) {
      if (!name.trim() || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters long'
        });
      }
      user.name = name.trim();
    }

    if (avatar !== undefined && avatar.trim()) {
      user.avatar = avatar.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
