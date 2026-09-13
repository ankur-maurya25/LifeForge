const express = require('express');
const router = express.Router();
const {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  searchUsers
} = require('../controllers/friendsController');
const { protect } = require('../middleware/authMiddleware');

// All friends & social routes require JWT authentication
router.use(protect);

router.get('/', getFriends);
router.get('/requests', getFriendRequests);
router.get('/search', searchUsers);
router.post('/request/:userId', sendFriendRequest);
router.patch('/request/:requestId/accept', acceptFriendRequest);
router.patch('/request/:requestId/reject', rejectFriendRequest);
router.delete('/:userId', removeFriend);

module.exports = router;
