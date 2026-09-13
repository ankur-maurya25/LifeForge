const mongoose = require('mongoose');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Quest = require('../models/Quest');
const DailyChallenge = require('../models/DailyChallenge');

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
 * Helper to compute date boundaries
 */
const getDayBoundary = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * @desc    Get complete analytics overview for authenticated user
 * @route   GET /api/analytics/overview
 * @access  Private (JWT)
 */
const getOverview = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;

    // Fetch user and counts in parallel
    const [user, totalGoals, completedGoals, activeGoals, totalQuests, completedQuests, pendingQuests, completedChallenges] =
      await Promise.all([
        User.findById(userId).select('name username xp level streak longestStreak lastCompletedChallengeDate'),
        Goal.countDocuments({ user: userId }),
        Goal.countDocuments({ user: userId, status: 'completed' }),
        Goal.countDocuments({ user: userId, status: 'active' }),
        Quest.countDocuments({ userId }),
        Quest.countDocuments({ userId, status: 'completed' }),
        Quest.countDocuments({ userId, status: 'pending' }),
        DailyChallenge.countDocuments({ userId, status: 'completed' })
      ]);

    const currentXp = user?.xp || 0;
    const level = user?.level || 1;
    const nextLevelXp = level * 500;
    const currentLevelBaseXp = (level - 1) * 500;
    const xpIntoLevel = Math.max(0, currentXp - currentLevelBaseXp);
    const xpProgressPercent = Math.min(100, Math.round((xpIntoLevel / 500) * 100));

    // In LifeForge RPG, each completed goal represents a defeated boss
    const bossesDefeated = completedGoals;

    const goalCompletionPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    const questCompletionPercentage = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        goals: {
          total: totalGoals,
          completed: completedGoals,
          active: activeGoals,
          completionPercentage: goalCompletionPercentage
        },
        quests: {
          total: totalQuests,
          completed: completedQuests,
          pending: pendingQuests,
          completionPercentage: questCompletionPercentage
        },
        xp: {
          totalXp: currentXp,
          level,
          nextLevelXp,
          xpIntoLevel,
          xpProgressPercent
        },
        streak: {
          currentStreak: user?.streak || 0,
          longestStreak: user?.longestStreak || user?.streak || 0,
          lastCompletedDate: user?.lastCompletedChallengeDate || null
        },
        bosses: {
          defeated: bossesDefeated,
          activeBosses: activeGoals
        },
        dailyChallenges: {
          completed: completedChallenges
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics overview',
      error: error.message
    });
  }
};

/**
 * @desc    Get detailed quest analytics (clearance rates, difficulties, 7 & 30 day history)
 * @route   GET /api/analytics/quests
 * @access  Private (JWT)
 */
const getQuestAnalytics = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    const sevenDaysAgo = getDayBoundary(7);
    const thirtyDaysAgo = getDayBoundary(30);

    const [totalQuests, completedQuests, pendingQuests, completed7Days, completed30Days, difficultyBreakdown, allCompletedQuests] =
      await Promise.all([
        Quest.countDocuments({ userId }),
        Quest.countDocuments({ userId, status: 'completed' }),
        Quest.countDocuments({ userId, status: 'pending' }),
        Quest.countDocuments({
          userId,
          status: 'completed',
          completedAt: { $gte: sevenDaysAgo }
        }),
        Quest.countDocuments({
          userId,
          status: 'completed',
          completedAt: { $gte: thirtyDaysAgo }
        }),
        Quest.aggregate([
          { $match: { userId } },
          {
            $group: {
              _id: '$difficulty',
              total: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
              }
            }
          }
        ]),
        Quest.find({
          userId,
          status: 'completed',
          completedAt: { $gte: sevenDaysAgo }
        }).select('title xpReward difficulty completedAt')
      ]);

    const completionPercentage = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

    // Group difficulty counts into standard object
    const difficulties = {
      Easy: { total: 0, completed: 0 },
      Medium: { total: 0, completed: 0 },
      Hard: { total: 0, completed: 0 }
    };

    difficultyBreakdown.forEach((item) => {
      if (item._id && difficulties[item._id]) {
        difficulties[item._id] = {
          total: item.total,
          completed: item.completed
        };
      }
    });

    // 7-day daily activity breakdown
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyCompletion7Days = [];

    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() - i);
      const dateStr = dayDate.toISOString().split('T')[0];
      const dayLabel = dayNames[dayDate.getDay()];

      // Count quests completed on this calendar date
      const count = allCompletedQuests.filter((q) => {
        if (!q.completedAt) return false;
        return q.completedAt.toISOString().split('T')[0] === dateStr;
      }).length;

      dailyCompletion7Days.push({
        date: dateStr,
        day: dayLabel,
        completedCount: count
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        totalQuests,
        completedQuests,
        pendingQuests,
        completionPercentage,
        completedLast7Days: completed7Days,
        completedLast30Days: completed30Days,
        difficultyBreakdown: difficulties,
        dailyCompletion7Days
      }
    });
  } catch (error) {
    console.error('Error fetching quest analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quest analytics',
      error: error.message
    });
  }
};

/**
 * @desc    Get goal progress and category distribution analytics
 * @route   GET /api/analytics/goals
 * @access  Private (JWT)
 */
const getGoalAnalytics = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;

    const [totalGoals, activeGoals, completedGoals, pausedGoals, categoryBreakdown, recentGoals] =
      await Promise.all([
        Goal.countDocuments({ user: userId }),
        Goal.countDocuments({ user: userId, status: 'active' }),
        Goal.countDocuments({ user: userId, status: 'completed' }),
        Goal.countDocuments({ user: userId, status: 'paused' }),
        Goal.aggregate([
          { $match: { user: userId } },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
              },
              avgProgress: { $avg: '$progress' }
            }
          }
        ]),
        Goal.find({ user: userId })
          .sort({ updatedAt: -1 })
          .limit(5)
          .select('title category difficulty status progress milestones updatedAt')
      ]);

    const completionPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    const categories = categoryBreakdown.map((item) => ({
      category: item._id || 'Uncategorized',
      count: item.count,
      completed: item.completed,
      avgProgress: Math.round(item.avgProgress || 0)
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalGoals,
        activeGoals,
        completedGoals,
        pausedGoals,
        completionPercentage,
        categories,
        recentGoals
      }
    });
  } catch (error) {
    console.error('Error fetching goal analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch goal analytics',
      error: error.message
    });
  }
};

/**
 * @desc    Get XP progression metrics and real calculated 7/30 days XP
 * @route   GET /api/analytics/xp
 * @access  Private (JWT)
 */
const getXpAnalytics = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    const sevenDaysAgo = getDayBoundary(7);
    const thirtyDaysAgo = getDayBoundary(30);

    const [user, quests7Days, challenges7Days, quests30Days, challenges30Days] = await Promise.all([
      User.findById(userId).select('xp level'),
      Quest.find({
        userId,
        status: 'completed',
        completedAt: { $gte: sevenDaysAgo }
      }).select('xpReward completedAt'),
      DailyChallenge.find({
        userId,
        status: 'completed',
        completedAt: { $gte: sevenDaysAgo }
      }).select('xpReward completedAt'),
      Quest.find({
        userId,
        status: 'completed',
        completedAt: { $gte: thirtyDaysAgo }
      }).select('xpReward completedAt'),
      DailyChallenge.find({
        userId,
        status: 'completed',
        completedAt: { $gte: thirtyDaysAgo }
      }).select('xpReward completedAt')
    ]);

    const totalXp = user?.xp || 0;
    const level = user?.level || 1;
    const nextLevelXp = level * 500;
    const currentLevelBaseXp = (level - 1) * 500;
    const xpIntoLevel = Math.max(0, totalXp - currentLevelBaseXp);
    const xpProgressPercent = Math.min(100, Math.round((xpIntoLevel / 500) * 100));

    // Sum XP earned in last 7 days
    const questXp7Days = quests7Days.reduce((sum, q) => sum + (q.xpReward || 0), 0);
    const challengeXp7Days = challenges7Days.reduce((sum, c) => sum + (c.xpReward || 0), 0);
    const xpEarnedLast7Days = questXp7Days + challengeXp7Days;

    // Sum XP earned in last 30 days
    const questXp30Days = quests30Days.reduce((sum, q) => sum + (q.xpReward || 0), 0);
    const challengeXp30Days = challenges30Days.reduce((sum, c) => sum + (c.xpReward || 0), 0);
    const xpEarnedLast30Days = questXp30Days + challengeXp30Days;

    // 7-day daily XP timeline
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyXp7Days = [];

    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() - i);
      const dateStr = dayDate.toISOString().split('T')[0];
      const dayLabel = dayNames[dayDate.getDay()];

      const qXp = quests7Days
        .filter((q) => q.completedAt && q.completedAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, q) => sum + (q.xpReward || 0), 0);

      const cXp = challenges7Days
        .filter((c) => c.completedAt && c.completedAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, c) => sum + (c.xpReward || 0), 0);

      dailyXp7Days.push({
        date: dateStr,
        day: dayLabel,
        xp: qXp + cXp
      });
    }

    // Identify peak day
    const peakXp = Math.max(...dailyXp7Days.map((d) => d.xp), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalXp,
        level,
        nextLevelXp,
        xpIntoLevel,
        xpProgressPercent,
        xpEarnedLast7Days,
        xpEarnedLast30Days,
        dailyXp7Days,
        peakXp
      }
    });
  } catch (error) {
    console.error('Error fetching XP analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch XP analytics',
      error: error.message
    });
  }
};

/**
 * @desc    Get streak consistency metrics and daily challenge records
 * @route   GET /api/analytics/streak
 * @access  Private (JWT)
 */
const getStreakAnalytics = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;

    const [user, totalChallenges, completedChallenges, pastChallenges] = await Promise.all([
      User.findById(userId).select('streak longestStreak lastCompletedChallengeDate'),
      DailyChallenge.countDocuments({ userId }),
      DailyChallenge.countDocuments({ userId, status: 'completed' }),
      DailyChallenge.find({ userId })
        .sort({ challengeDate: -1 })
        .limit(14)
        .select('title difficulty xpReward challengeDate status completedAt')
    ]);

    const currentStreak = user?.streak || 0;
    const longestStreak = user?.longestStreak || user?.streak || 0;

    // Consistency score: completed daily challenges / total active days
    const challengeClearanceRate =
      totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        currentStreak,
        longestStreak,
        lastCompletedDate: user?.lastCompletedChallengeDate || null,
        totalChallenges,
        completedChallenges,
        challengeClearanceRate,
        recentChallengeHistory: pastChallenges
      }
    });
  } catch (error) {
    console.error('Error fetching streak analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch streak analytics',
      error: error.message
    });
  }
};

module.exports = {
  getOverview,
  getQuestAnalytics,
  getGoalAnalytics,
  getXpAnalytics,
  getStreakAnalytics
};
