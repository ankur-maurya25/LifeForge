const mongoose = require('mongoose');
const Notification = require('../models/Notification');

/**
 * Reusable helper to safely create a notification for any user event
 *
 * @param {Object} params
 * @param {string|mongoose.Types.ObjectId} params.userId - Target recipient user ID
 * @param {'quest'|'goal'|'challenge'|'boss'|'friend'|'achievement'|'system'} params.type - Category of notification
 * @param {string} params.title - Short alert title
 * @param {string} params.message - Detailed alert message
 * @param {any} [params.relatedId] - Optional linked entity ID (e.g. questId, goalId, requestId)
 * @returns {Promise<Object|null>} The created notification or null if failed
 */
const createNotification = async ({ userId, type = 'system', title, message, relatedId = null }) => {
  try {
    if (!userId || !title || !message) {
      console.warn('⚠️ [notificationService] Missing required fields for notification');
      return null;
    }

    if (mongoose.connection.readyState !== 1) {
      // Database offline, skip persistence safely
      return null;
    }

    const notification = await Notification.create({
      userId,
      type,
      title: title.trim(),
      message: message.trim(),
      relatedId,
      isRead: false
    });

    return notification;
  } catch (err) {
    console.error('❌ [notificationService.createNotification error]:', err.message);
    return null;
  }
};

module.exports = {
  createNotification
};
