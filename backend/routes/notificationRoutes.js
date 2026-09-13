const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// All notification routes require JWT authentication
router.use(protect);

// Read endpoints
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);

// Specific bulk operations must be registered before parameterized ':id' routes
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

router.delete('/clear-all', clearAllNotifications);
router.delete('/:id', deleteNotification);

module.exports = router;
