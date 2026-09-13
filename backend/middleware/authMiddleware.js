const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware: Verifies JWT token and attaches user to req.user
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check for 'Authorization: Bearer <token>' header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Reject if token is missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Missing token.'
    });
  }

  try {
    // 3. Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'lifeforge_super_secret_jwt_key_2026'
    );

    // Check if database is connected before querying User
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is offline. Please ensure MongoDB is running or configure MONGO_URI in .env.'
      });
    }

    // 4. Find user by id (ensure password is excluded)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Check if user account has been suspended
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by a Realm Guardian (Admin).'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Invalid or expired token.'
    });
  }
};

/**
 * RequireAdmin middleware: Verifies authenticated user has 'admin' role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required.'
    });
  }

  next();
};

module.exports = { protect, requireAdmin };
