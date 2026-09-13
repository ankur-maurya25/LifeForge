const mongoose = require('mongoose');
const User = require('../models/User');
const Quest = require('../models/Quest');

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
 * Build sort stages based on requested ranking type with deterministic tie-breaking
 * Tie-breaker rule: XP -> Level -> Completed Quests -> _id (stable ascending)
 */
const getSortCriteria = (type) => {
  switch (type) {
    case 'level':
      return { level: -1, xp: -1, completedQuests: -1, _id: 1 };
    case 'quests':
      return { completedQuests: -1, xp: -1, level: -1, _id: 1 };
    case 'streak':
      return { streak: -1, longestStreak: -1, xp: -1, level: -1, _id: 1 };
    case 'xp':
    default:
      return { xp: -1, level: -1, completedQuests: -1, _id: 1 };
  }
};

/**
 * Helper to get all users with their completed quests count and sorted by criteria
 */
const getRankedUsersList = async (sortCriteria, currentUserId) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: 'quests',
        let: { uId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$uId'] },
                  { $eq: ['$status', 'completed'] }
                ]
              }
            }
          }
        ],
        as: 'completedQuestsList'
      }
    },
    {
      $addFields: {
        completedQuests: { $size: '$completedQuestsList' }
      }
    },
    {
      $project: {
        completedQuestsList: 0,
        password: 0,
        email: 0,
        __v: 0
      }
    },
    {
      $sort: sortCriteria
    }
  ]);

  return users.map((u, index) => ({
    rank: index + 1,
    _id: u._id,
    username: u.username || 'unknown',
    name: u.name || u.username || 'Anonymous Hunter',
    avatar: u.avatar || (u.name ? u.name.charAt(0).toUpperCase() : 'A'),
    xp: typeof u.xp === 'number' ? u.xp : 0,
    level: typeof u.level === 'number' ? u.level : 1,
    completedQuests: u.completedQuests || 0,
    streak: typeof u.streak === 'number' ? u.streak : 0,
    longestStreak: typeof u.longestStreak === 'number' ? u.longestStreak : (u.streak || 0),
    isCurrentUser: currentUserId ? u._id.toString() === currentUserId.toString() : false
  }));
};

/**
 * @desc    Get ranked leaderboard with pagination and user ranking
 * @route   GET /api/leaderboard
 * @access  Private (JWT)
 */
const getLeaderboard = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const validTypes = ['xp', 'level', 'quests', 'streak'];
    const type = validTypes.includes(req.query.type) ? req.query.type : 'xp';

    // Pagination validation (safe bounds: 1 <= limit <= 50, page >= 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const sortCriteria = getSortCriteria(type);
    const rankedUsers = await getRankedUsersList(sortCriteria, req.user._id);

    const totalUsers = rankedUsers.length;
    const totalPages = Math.ceil(totalUsers / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = rankedUsers.slice(startIndex, startIndex + limit);

    // Locate current logged-in user rank
    let currentUserStanding = rankedUsers.find((u) => u.isCurrentUser);

    if (!currentUserStanding && req.user) {
      currentUserStanding = {
        rank: totalUsers + 1,
        _id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        avatar: req.user.avatar || 'A',
        xp: req.user.xp || 0,
        level: req.user.level || 1,
        completedQuests: 0,
        streak: req.user.streak || 0,
        longestStreak: req.user.longestStreak || 0,
        isCurrentUser: true
      };
    }

    return res.status(200).json({
      success: true,
      type,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages
      },
      currentUser: currentUserStanding,
      data: paginatedUsers
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard rankings',
      error: error.message
    });
  }
};

/**
 * @desc    Get current user ranking across all ranking categories
 * @route   GET /api/leaderboard/me
 * @access  Private (JWT)
 */
const getMyLeaderboardRank = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const currentUserId = req.user._id;

    // Fetch lists across the 4 types
    const [xpList, levelList, questsList, streakList] = await Promise.all([
      getRankedUsersList(getSortCriteria('xp'), currentUserId),
      getRankedUsersList(getSortCriteria('level'), currentUserId),
      getRankedUsersList(getSortCriteria('quests'), currentUserId),
      getRankedUsersList(getSortCriteria('streak'), currentUserId)
    ]);

    const totalUsers = xpList.length;

    const findRank = (list) => {
      const found = list.find((u) => u.isCurrentUser);
      return found ? found.rank : totalUsers + 1;
    };

    const userEntry = xpList.find((u) => u.isCurrentUser) || {
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      avatar: req.user.avatar || 'A',
      xp: req.user.xp || 0,
      level: req.user.level || 1,
      completedQuests: 0,
      streak: req.user.streak || 0,
      longestStreak: req.user.longestStreak || 0,
      isCurrentUser: true
    };

    return res.status(200).json({
      success: true,
      data: {
        rank: findRank(xpList),
        totalUsers,
        user: userEntry,
        ranksByType: {
          xp: findRank(xpList),
          level: findRank(levelList),
          quests: findRank(questsList),
          streak: findRank(streakList)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user leaderboard rank:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user ranking',
      error: error.message
    });
  }
};

/**
 * @desc    Get overall leaderboard statistics & top player
 * @route   GET /api/leaderboard/stats
 * @access  Private (JWT)
 */
const getLeaderboardStats = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const rankedUsers = await getRankedUsersList(getSortCriteria('xp'), req.user._id);
    const totalUsers = rankedUsers.length;

    if (totalUsers === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalUsers: 0,
          topUser: null,
          averageXp: 0,
          highestStreak: 0,
          totalQuestsCompleted: 0
        }
      });
    }

    const topUser = rankedUsers[0];
    const totalXp = rankedUsers.reduce((sum, u) => sum + (u.xp || 0), 0);
    const averageXp = Math.round(totalXp / totalUsers);
    const highestStreak = Math.max(...rankedUsers.map((u) => u.streak || 0));
    const totalQuestsCompleted = rankedUsers.reduce((sum, u) => sum + (u.completedQuests || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        topUser,
        averageXp,
        highestStreak,
        totalQuestsCompleted
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getLeaderboard,
  getMyLeaderboardRank,
  getLeaderboardStats,
  getSortCriteria,
  getRankedUsersList
};
