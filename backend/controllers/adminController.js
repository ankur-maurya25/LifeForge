const mongoose = require('mongoose');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Quest = require('../models/Quest');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const DailyChallenge = require('../models/DailyChallenge');
const { seedDefaultAchievements } = require('../utils/achievementService');

const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database connection is currently offline. Please ensure MongoDB is running.'
    });
    return false;
  }
  return true;
};

/**
 * @desc    Get real platform statistics overview for admin
 * @route   GET /api/admin/overview
 * @access  Private/Admin
 */
const getAdminOverview = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const [
      totalUsers,
      activeUsers,
      totalGoals,
      completedGoals,
      totalQuests,
      completedQuests,
      xpAgg,
      totalAchievementsUnlocked,
      totalChallengesCompleted,
      totalAchievementsCatalog
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      Goal.countDocuments(),
      Goal.countDocuments({ status: 'completed' }),
      Quest.countDocuments(),
      Quest.countDocuments({ status: 'completed' }),
      User.aggregate([{ $group: { _id: null, totalXp: { $sum: '$xp' } } }]),
      UserAchievement.countDocuments(),
      DailyChallenge.countDocuments({ status: 'completed' }),
      Achievement.countDocuments()
    ]);

    const totalXpEarned = xpAgg.length > 0 ? xpAgg[0].totalXp : 0;
    const totalBossesDefeated = completedGoals; // In LifeForge, completed goals represent defeated campaign bosses

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalGoals,
        completedGoals,
        totalQuests,
        completedQuests,
        totalXpEarned,
        totalAchievementsUnlocked,
        totalAchievementsCatalog,
        totalBossesDefeated,
        totalChallengesCompleted
      }
    });
  } catch (error) {
    console.error('❌ [getAdminOverview error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin overview',
      error: error.message
    });
  }
};

/**
 * @desc    Get paginated users with optional search & status filter
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAdminUsers = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = {};

    // Sanitize and apply search query
    if (req.query.search && typeof req.query.search === 'string' && req.query.search.trim()) {
      const sanitized = req.query.search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      filter.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { username: { $regex: sanitized, $options: 'i' } },
        { email: { $regex: sanitized, $options: 'i' } }
      ];
    }

    if (req.query.status && ['active', 'inactive', 'suspended'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    if (req.query.role && ['user', 'admin'].includes(req.query.role)) {
      filter.role = req.query.role;
    }

    const [totalUsers, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit) || 1
      },
      data: users
    });
  } catch (error) {
    console.error('❌ [getAdminUsers error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

/**
 * @desc    Get single user details by ID for admin
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getAdminUserById = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID format'
      });
    }

    const targetUser = await User.findById(id).select('-password');
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Also fetch their goals & quests summary
    const [goalsCount, completedGoalsCount, questsCount, completedQuestsCount, achievementsCount] = await Promise.all([
      Goal.countDocuments({ user: id }),
      Goal.countDocuments({ user: id, status: 'completed' }),
      Quest.countDocuments({ userId: id }),
      Quest.countDocuments({ userId: id, status: 'completed' }),
      UserAchievement.countDocuments({ userId: id })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        ...targetUser.toObject(),
        stats: {
          goalsCount,
          completedGoalsCount,
          questsCount,
          completedQuestsCount,
          achievementsCount
        }
      }
    });
  } catch (error) {
    console.error('❌ [getAdminUserById error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user details',
      error: error.message
    });
  }
};

/**
 * @desc    Update user account status (active, inactive, suspended) or role
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private/Admin
 */
const updateUserStatus = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { id } = req.params;
    const { status, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID format'
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Safety rule: Admin cannot deactivate or remove admin access from themselves
    if (targetUser._id.toString() === req.user._id.toString()) {
      if (status && status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Security warning: You cannot deactivate your own admin account.'
        });
      }
      if (role && role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Security warning: You cannot remove admin role from your own account.'
        });
      }
    }

    if (status) {
      if (!['active', 'inactive', 'suspended'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be active, inactive, or suspended.'
        });
      }
      targetUser.status = status;
    }

    if (role) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be user or admin.'
        });
      }
      targetUser.role = role;
    }

    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `User "${targetUser.name}" updated successfully.`,
      data: targetUser.toSafeObject()
    });
  } catch (error) {
    console.error('❌ [updateUserStatus error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

/**
 * @desc    Get all campaign goals across the realm
 * @route   GET /api/admin/goals
 * @access  Private/Admin
 */
const getAdminGoals = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const goals = await Goal.find()
      .populate('user', 'name username email avatar level')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    console.error('❌ [getAdminGoals error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve realm goals',
      error: error.message
    });
  }
};

/**
 * @desc    Get all quests across the realm
 * @route   GET /api/admin/quests
 * @access  Private/Admin
 */
const getAdminQuests = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const quests = await Quest.find()
      .populate('userId', 'name username avatar')
      .populate('goalId', 'title category')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: quests.length,
      data: quests
    });
  } catch (error) {
    console.error('❌ [getAdminQuests error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve realm quests',
      error: error.message
    });
  }
};

/**
 * @desc    Get all achievements in the catalog
 * @route   GET /api/admin/achievements
 * @access  Private/Admin
 */
const getAdminAchievements = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    await seedDefaultAchievements();

    const achievements = await Achievement.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('❌ [getAdminAchievements error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve achievements catalog',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new achievement
 * @route   POST /api/admin/achievements
 * @access  Private/Admin
 */
const createAdminAchievement = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const {
      title,
      description,
      icon,
      category,
      requirementType,
      requirementValue,
      xpReward,
      isActive
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Achievement title is required'
      });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Achievement description is required'
      });
    }

    const validCategories = ['quest', 'goal', 'streak', 'xp', 'boss', 'challenge', 'social'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    const validReqTypes = [
      'completed_quests',
      'created_goals',
      'completed_goals',
      'streak_days',
      'total_xp',
      'defeated_bosses',
      'completed_challenges',
      'friends_count'
    ];

    if (!requirementType || !validReqTypes.includes(requirementType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid requirementType. Must be one of: ${validReqTypes.join(', ')}`
      });
    }

    const numReqVal = Number(requirementValue);
    if (isNaN(numReqVal) || numReqVal < 1) {
      return res.status(400).json({
        success: false,
        message: 'requirementValue must be a positive number (minimum 1)'
      });
    }

    const numXp = Number(xpReward);
    if (isNaN(numXp) || numXp < 0) {
      return res.status(400).json({
        success: false,
        message: 'xpReward must be a non-negative number'
      });
    }

    // Check duplicate title
    const existing = await Achievement.findOne({ title: title.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An achievement with this title already exists'
      });
    }

    const achievement = await Achievement.create({
      title: title.trim(),
      description: description.trim(),
      icon: icon ? icon.trim() : '🏆',
      category,
      requirementType,
      requirementValue: numReqVal,
      xpReward: numXp,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    return res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement
    });
  } catch (error) {
    console.error('❌ [createAdminAchievement error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create achievement',
      error: error.message
    });
  }
};

/**
 * @desc    Update an existing achievement
 * @route   PUT /api/admin/achievements/:id
 * @access  Private/Admin
 */
const updateAdminAchievement = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Achievement ID format'
      });
    }

    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    const {
      title,
      description,
      icon,
      category,
      requirementType,
      requirementValue,
      xpReward,
      isActive
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ success: false, message: 'Title cannot be empty' });
      }
      achievement.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ success: false, message: 'Description cannot be empty' });
      }
      achievement.description = description.trim();
    }

    if (icon !== undefined) achievement.icon = icon.trim() || '🏆';

    if (category !== undefined) {
      const validCategories = ['quest', 'goal', 'streak', 'xp', 'boss', 'challenge', 'social'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
      achievement.category = category;
    }

    if (requirementType !== undefined) {
      const validReqTypes = [
        'completed_quests',
        'created_goals',
        'completed_goals',
        'streak_days',
        'total_xp',
        'defeated_bosses',
        'completed_challenges',
        'friends_count'
      ];
      if (!validReqTypes.includes(requirementType)) {
        return res.status(400).json({ success: false, message: 'Invalid requirementType' });
      }
      achievement.requirementType = requirementType;
    }

    if (requirementValue !== undefined) {
      const numVal = Number(requirementValue);
      if (isNaN(numVal) || numVal < 1) {
        return res.status(400).json({ success: false, message: 'requirementValue must be at least 1' });
      }
      achievement.requirementValue = numVal;
    }

    if (xpReward !== undefined) {
      const numXp = Number(xpReward);
      if (isNaN(numXp) || numXp < 0) {
        return res.status(400).json({ success: false, message: 'xpReward cannot be negative' });
      }
      achievement.xpReward = numXp;
    }

    if (isActive !== undefined) {
      achievement.isActive = Boolean(isActive);
    }

    await achievement.save();

    return res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    console.error('❌ [updateAdminAchievement error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update achievement',
      error: error.message
    });
  }
};

/**
 * @desc    Delete an achievement
 * @route   DELETE /api/admin/achievements/:id
 * @access  Private/Admin
 */
const deleteAdminAchievement = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Achievement ID format'
      });
    }

    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    await Achievement.findByIdAndDelete(id);

    // Optionally cleanup user unlocks for this achievement
    await UserAchievement.deleteMany({ achievementId: id });

    return res.status(200).json({
      success: true,
      message: `Achievement "${achievement.title}" and associated unlock logs deleted successfully.`
    });
  } catch (error) {
    console.error('❌ [deleteAdminAchievement error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete achievement',
      error: error.message
    });
  }
};

module.exports = {
  getAdminOverview,
  getAdminUsers,
  getAdminUserById,
  updateUserStatus,
  getAdminGoals,
  getAdminQuests,
  getAdminAchievements,
  createAdminAchievement,
  updateAdminAchievement,
  deleteAdminAchievement
};
