const mongoose = require('mongoose');
const Notification = require('../models/Notification');

/**
 * Check if MongoDB connection is active
 */
const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database is currently offline. Please ensure MongoDB is running or configure MONGO_URI.'
    });
    return false;
  }
  return true;
};

/**
 * @desc    Get all notifications for authenticated user
 * @route   GET /api/notifications
 * @access  Private (JWT)
 */
const getNotifications = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    const { type, unreadOnly, page = 1, limit = 50 } = req.query;

    const filter = { userId };

    if (type && ['quest', 'goal', 'challenge', 'boss', 'friend', 'achievement', 'system'].includes(type)) {
      filter.type = type;
    }

    if (unreadOnly === 'true' || unreadOnly === true) {
      filter.isRead = false;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId, isRead: false })
    ]);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: notifications
    });
  } catch (error) {
    console.error('❌ [getNotifications error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message
    });
  }
};

/**
 * @desc    Get unread notifications count for header badge
 * @route   GET /api/notifications/unread-count
 * @access  Private (JWT)
 */
const getUnreadCount = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    const count = await Notification.countDocuments({ userId, isRead: false });

    return res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('❌ [getUnreadCount error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch unread notification count',
      error: error.message
    });
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private (JWT)
 */
const markAsRead = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID format'
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Verify ownership
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to modify this notification.'
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('❌ [markAsRead error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

/**
 * @desc    Mark all notifications as read for current user
 * @route   PATCH /api/notifications/read-all
 * @access  Private (JWT)
 */
const markAllAsRead = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('❌ [markAllAsRead error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a single notification
 * @route   DELETE /api/notifications/:id
 * @access  Private (JWT)
 */
const deleteNotification = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID format'
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Verify ownership
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to delete this notification.'
      });
    }

    await notification.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('❌ [deleteNotification error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

/**
 * @desc    Clear all notifications for current user
 * @route   DELETE /api/notifications/clear-all
 * @access  Private (JWT)
 */
const clearAllNotifications = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;

    const result = await Notification.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: 'All notifications cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('❌ [clearAllNotifications error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear notifications',
      error: error.message
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
};
