const mongoose = require('mongoose');
const DailyChallenge = require('../models/DailyChallenge');
const User = require('../models/User');
const { createNotification } = require('../utils/notificationService');
const { checkAndUnlockAchievements } = require('../utils/achievementService');

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
 * Helper to get today's date in YYYY-MM-DD format
 */
const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Helper to get yesterday's date in YYYY-MM-DD format
 */
const getYesterdayDateString = () => {
  const yesterday = new Date(Date.now() - 86400000);
  return yesterday.toISOString().split('T')[0];
};

/**
 * Predefined challenge pool for RPG daily challenges
 */
const CHALLENGE_POOL = [
  {
    title: 'Hydration Elixir',
    description: 'Drink 8 glasses (2 liters) of water throughout the day to replenish your vitality and mana.',
    difficulty: 'Easy',
    xpReward: 30
  },
  {
    title: 'Sanctuary Purification',
    description: 'Spend 10 minutes decluttering your desk and organizing your workspace for optimal focus.',
    difficulty: 'Easy',
    xpReward: 35
  },
  {
    title: 'Mindful Centering',
    description: 'Practice 5 to 10 minutes of mindful breathing or meditation before your core work session.',
    difficulty: 'Easy',
    xpReward: 35
  },
  {
    title: 'Tome of Wisdom',
    description: 'Read at least 15 pages of an educational or skill-building book.',
    difficulty: 'Easy',
    xpReward: 40
  },
  {
    title: 'Deep Focus Sprint',
    description: 'Complete 45 minutes of uninterrupted deep work with all distractions silenced.',
    difficulty: 'Medium',
    xpReward: 50
  },
  {
    title: 'Physical Conditioning Drill',
    description: 'Complete 30 minutes of vigorous workout, jogging, or home fitness exercises.',
    difficulty: 'Medium',
    xpReward: 50
  },
  {
    title: 'Code Kata Mastery',
    description: 'Solve 1 algorithmic challenge or build a polished, reusable UI component.',
    difficulty: 'Medium',
    xpReward: 60
  },
  {
    title: 'Quest Log Vanguard',
    description: 'Clear and complete at least 2 active quests from your LifeForge quest log today.',
    difficulty: 'Medium',
    xpReward: 55
  },
  {
    title: 'Architect’s Focus Marathon',
    description: 'Execute 90 minutes of continuous high-intensity coding, problem solving, or creative design.',
    difficulty: 'Hard',
    xpReward: 80
  },
  {
    title: 'Mastery Citadel Build',
    description: 'Complete an end-to-end feature, debug a complex module, or write comprehensive documentation.',
    difficulty: 'Hard',
    xpReward: 90
  },
  {
    title: 'Champion’s Perfect Day',
    description: 'Fulfill all daily priorities, review progress towards your primary goal, and log achievements.',
    difficulty: 'Hard',
    xpReward: 100
  }
];

/**
 * Select a challenge template deterministically or pseudo-randomly
 */
const pickChallengeTemplate = (dateStr, difficultyPreference) => {
  let pool = CHALLENGE_POOL;
  if (difficultyPreference && ['Easy', 'Medium', 'Hard'].includes(difficultyPreference)) {
    pool = CHALLENGE_POOL.filter((c) => c.difficulty === difficultyPreference);
    if (pool.length === 0) pool = CHALLENGE_POOL;
  }

  // Calculate day-based hash index for variety
  const dateNum = dateStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
  const index = dateNum % pool.length;
  return pool[index];
};

/**
 * @desc    Get today's daily challenge for the logged-in user (auto-generate if none exists)
 * @route   GET /api/daily-challenges/today
 * @access  Private (JWT)
 */
const getTodayChallenge = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const todayStr = getTodayDateString();

    // 1. Look for today's challenge
    let challenge = await DailyChallenge.findOne({
      userId: req.user._id,
      challengeDate: todayStr
    });

    // 2. If not found, auto-generate today's challenge
    if (!challenge) {
      const template = pickChallengeTemplate(todayStr);

      challenge = await DailyChallenge.create({
        userId: req.user._id,
        title: template.title,
        description: template.description,
        difficulty: template.difficulty,
        xpReward: template.xpReward,
        challengeDate: todayStr,
        status: 'pending'
      });
    }

    return res.status(200).json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Error fetching today challenge:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch daily challenge',
      error: error.message
    });
  }
};

/**
 * @desc    Get past daily challenges history for logged-in user
 * @route   GET /api/daily-challenges/history
 * @access  Private (JWT)
 */
const getChallengeHistory = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const challenges = await DailyChallenge.find({ userId: req.user._id })
      .sort({ challengeDate: -1, createdAt: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (error) {
    console.error('Error fetching challenge history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch challenge history',
      error: error.message
    });
  }
};

/**
 * @desc    Generate a daily challenge for today if none exists
 * @route   POST /api/daily-challenges/generate
 * @access  Private (JWT)
 */
const generateChallenge = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const todayStr = getTodayDateString();

    // Check if one already exists
    const existing = await DailyChallenge.findOne({
      userId: req.user._id,
      challengeDate: todayStr
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Daily challenge for today already exists',
        data: existing
      });
    }

    const { difficulty } = req.body || {};
    const template = pickChallengeTemplate(todayStr, difficulty);

    const newChallenge = await DailyChallenge.create({
      userId: req.user._id,
      title: template.title,
      description: template.description,
      difficulty: template.difficulty,
      xpReward: template.xpReward,
      challengeDate: todayStr,
      status: 'pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Daily challenge generated successfully',
      data: newChallenge
    });
  } catch (error) {
    console.error('Error generating daily challenge:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate daily challenge',
      error: error.message
    });
  }
};

/**
 * @desc    Complete a daily challenge and update user streak & XP
 * @route   PATCH /api/daily-challenges/:id/complete
 * @access  Private (JWT)
 */
const completeChallenge = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid challenge ID format'
      });
    }

    const challenge = await DailyChallenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Daily challenge not found'
      });
    }

    // Ownership check
    if (challenge.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this challenge'
      });
    }

    // Check if already completed
    if (challenge.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Challenge already completed'
      });
    }

    // 1. Mark challenge as completed
    challenge.status = 'completed';
    challenge.completedAt = new Date();
    await challenge.save();

    // 2. Fetch user to update streak and XP
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();

    // Streak Logic:
    // If completed yesterday, increment streak
    // If completed today (already handled by challenge status, but safe fallback), keep streak
    // Otherwise (missed yesterday or starting fresh), reset streak to 1
    if (user.lastCompletedChallengeDate === yesterdayStr) {
      user.streak = (user.streak || 0) + 1;
    } else if (user.lastCompletedChallengeDate === todayStr) {
      // Streak already counted for today
    } else {
      user.streak = 1;
    }

    // Update longest streak
    user.longestStreak = Math.max(user.longestStreak || 0, user.streak);
    user.lastCompletedChallengeDate = todayStr;

    // Award XP and calculate level
    const oldLevel = user.level || Math.floor((user.xp || 0) / 500) + 1;
    const xpReward = challenge.xpReward || 50;
    user.xp = (user.xp || 0) + xpReward;
    user.level = Math.floor(user.xp / 500) + 1;

    await user.save();

    // 1. Dispatch Daily Challenge Completed Notification
    createNotification({
      userId: req.user._id,
      type: 'challenge',
      title: `Daily Bounty Cleared: “${challenge.title}”`,
      message: `You conquered today's challenge and earned +${xpReward} XP! Current streak: ${user.streak} days.`,
      relatedId: challenge._id
    });

    // 2. Dispatch Level-Up Achievement Notification if applicable
    if (user.level > oldLevel) {
      createNotification({
        userId: req.user._id,
        type: 'achievement',
        title: `Level Up Achieved: Level ${user.level}`,
        message: `Congratulations! Your character advanced to Level ${user.level} Champion!`,
        relatedId: req.user._id
      });
    }

    // 3. Trigger achievement unlock check (streaks, challenge count, XP)
    checkAndUnlockAchievements(req.user._id).catch(() => {});

    return res.status(200).json({
      success: true,
      message: `Challenge completed! You earned +${xpReward} XP and updated your streak to ${user.streak}!`,
      data: {
        challenge,
        user: user.toSafeObject ? user.toSafeObject() : user
      }
    });
  } catch (error) {
    console.error('Error completing daily challenge:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete daily challenge',
      error: error.message
    });
  }
};

module.exports = {
  getTodayChallenge,
  getChallengeHistory,
  generateChallenge,
  completeChallenge
};
