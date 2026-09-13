const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAchievements,
  getUnlockedAchievements,
  getAchievementProgress,
  claimAchievementReward
} = require('../controllers/achievementController');

router.use(protect);

router.get('/', getAchievements);
router.get('/unlocked', getUnlockedAchievements);
router.get('/progress', getAchievementProgress);
router.post('/:id/claim', claimAchievementReward);

module.exports = router;