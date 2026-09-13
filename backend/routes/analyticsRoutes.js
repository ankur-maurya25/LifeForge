const express = require('express');
const router = express.Router();
const {
  getOverview,
  getQuestAnalytics,
  getGoalAnalytics,
  getXpAnalytics,
  getStreakAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All analytics routes require JWT authentication
router.use(protect);

router.get('/overview', getOverview);
router.get('/quests', getQuestAnalytics);
router.get('/goals', getGoalAnalytics);
router.get('/xp', getXpAnalytics);
router.get('/streak', getStreakAnalytics);

module.exports = router;
