const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getMyLeaderboardRank,
  getLeaderboardStats
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

// All leaderboard routes are protected by JWT authentication
router.use(protect);

router.get('/', getLeaderboard);
router.get('/me', getMyLeaderboardRank);
router.get('/stats', getLeaderboardStats);

module.exports = router;
