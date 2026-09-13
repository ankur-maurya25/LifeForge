const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const {
  checkAndUnlockAchievements,
  getAllAchievementsWithProgress
} = require('../utils/achievementService');
const { checkLevelUp } = require('../utils/levelService');
const { createNotification } = require('../utils/notificationService');

const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database connection is currently unavailable. Please ensure MongoDB is running.'
    });
    return false;
  }
  return true;
};

const getAchievements = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    await checkAndUnlockAchievements(userId);
    let list = await getAllAchievementsWithProgress(userId);

    if (req.query.category) {
      list = list.filter((a) => a.category === req.query.category);
    }

    if (req.query.status === 'unlocked') {
      list = list.filter((a) => a.isUnlocked);
    } else if (req.query.status === 'locked') {
      list = list.filter((a) => !a.isUnlocked);
    } else if (req.query.status === 'claimable') {
      list = list.filter((a) => a.isUnlocked && !a.rewardClaimed);
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    console.error('❌ [getAchievements error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve achievements',
      error: error.message
    });
  }
};

const getUnlockedAchievements = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    await checkAndUnlockAchievements(userId);
    const list = await getAllAchievementsWithProgress(userId);
    const unlocked = list.filter((a) => a.isUnlocked);

    return res.status(200).json({
      success: true,
      count: unlocked.length,
      data: unlocked
    });
  } catch (error) {
    console.error('❌ [getUnlockedAchievements error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve unlocked achievements',
      error: error.message
    });
  }
};

const getAchievementProgress = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    await checkAndUnlockAchievements(userId);
    const list = await getAllAchievementsWithProgress(userId);
    const total = list.length;
    const unlocked = list.filter((a) => a.isUnlocked).length;
    const locked = total - unlocked;
    const claimable = list.filter((a) => a.isUnlocked && !a.rewardClaimed).length;
    const claimed = list.filter((a) => a.isUnlocked && a.rewardClaimed).length;
    const completionPercent = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalAchievements: total,
        unlockedCount: unlocked,
        lockedCount: locked,
        claimableCount: claimable,
        claimedCount: claimed,
        completionPercent
      }
    });
  } catch (error) {
    console.error('❌ [getAchievementProgress error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve achievement progress',
      error: error.message
    });
  }
};

const claimAchievementReward = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    const achievementId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(achievementId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid achievement ID format'
      });
    }

    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    const userAch = await UserAchievement.findOne({
      userId,
      achievementId
    });

    if (!userAch) {
      return res.status(400).json({
        success: false,
        message: 'This achievement has not been unlocked yet'
      });
    }

    if (userAch.rewardClaimed) {
      return res.status(400).json({
        success: false,
        message: 'Reward has already been claimed for this achievement'
      });
    }

    userAch.rewardClaimed = true;
    await userAch.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const xpReward = achievement.xpReward || 100;
    const levelCheck = checkLevelUp(user.xp || 0, xpReward);

    user.xp = levelCheck.newTotalXp;
    user.level = levelCheck.newLevel;
    await user.save();

    if (levelCheck.leveledUp) {
      createNotification({
        userId,
        type: 'achievement',
        title: 'Level Up Achieved: Level ' + levelCheck.newLevel,
        message: 'Claiming achievement "' + achievement.title + '" elevated you to Level ' + levelCheck.newLevel + '!',
        relatedId: achievement._id
      });
    }

    checkAndUnlockAchievements(userId).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Reward claimed successfully! +' + xpReward + ' XP awarded!',
      data: {
        achievementId: achievement._id,
        xpReward,
        newTotalXp: user.xp,
        newLevel: user.level,
        leveledUp: levelCheck.leveledUp
      }
    });
  } catch (error) {
    console.error('❌ [claimAchievementReward error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to claim achievement reward',
      error: error.message
    });
  }
};

module.exports = {
  getAchievements,
  getUnlockedAchievements,
  getAchievementProgress,
  claimAchievementReward
};