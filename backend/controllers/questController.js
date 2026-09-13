const mongoose = require('mongoose');
const Quest = require('../models/Quest');
const Goal = require('../models/Goal');
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
 * @desc    Create a new Quest (optionally linked to a Goal)
 * @route   POST /api/quests
 * @access  Private (JWT)
 */
const createQuest = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { title, description, difficulty, xpReward, dueDate, goalId } = req.body;

    // 1. Title validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Quest title is required'
      });
    }

    if (title.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Quest title must be at least 2 characters long'
      });
    }

    // 2. XP reward validation
    let numericXp = xpReward !== undefined ? Number(xpReward) : 40;
    if (isNaN(numericXp) || numericXp <= 0) {
      return res.status(400).json({
        success: false,
        message: 'XP reward must be a positive number'
      });
    }

    // 3. Due date validation
    let parsedDueDate = null;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid due date format'
        });
      }
    }

    // 4. Goal validation if goalId provided
    let verifiedGoalId = null;
    if (goalId && goalId !== 'none' && goalId !== '') {
      if (!mongoose.Types.ObjectId.isValid(goalId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Goal ID format'
        });
      }

      const existingGoal = await Goal.findById(goalId);
      if (!existingGoal || existingGoal.user.toString() !== req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Specified Goal does not exist or does not belong to the authenticated user'
        });
      }
      verifiedGoalId = existingGoal._id;
    }

    // 5. Difficulty validation
    const allowedDifficulties = ['Easy', 'Medium', 'Hard'];
    const finalDifficulty = allowedDifficulties.includes(difficulty) ? difficulty : 'Medium';

    // 6. Create quest document
    const quest = await Quest.create({
      userId: req.user._id,
      goalId: verifiedGoalId,
      title: title.trim(),
      description: description ? description.trim() : '',
      difficulty: finalDifficulty,
      xpReward: numericXp,
      status: 'pending',
      dueDate: parsedDueDate
    });

    // Populate goal details for response
    if (verifiedGoalId) {
      await quest.populate('goalId', 'title category difficulty progress');
    }

    return res.status(201).json({
      success: true,
      message: 'Quest forged successfully',
      quest
    });
  } catch (error) {
    console.error('❌ [createQuest error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create quest'
    });
  }
};

/**
 * @desc    Get all quests for the authenticated user
 * @route   GET /api/quests
 * @access  Private (JWT)
 */
const getMyQuests = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const filter = { userId: req.user._id };

    // Support optional query status: 'pending' or 'completed'
    if (req.query.status && ['pending', 'completed'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    // Support optional query by goalId
    if (req.query.goalId && mongoose.Types.ObjectId.isValid(req.query.goalId)) {
      filter.goalId = req.query.goalId;
    }

    const quests = await Quest.find(filter)
      .populate('goalId', 'title category difficulty progress')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: quests.length,
      quests
    });
  } catch (error) {
    console.error('❌ [getMyQuests error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve quests'
    });
  }
};

/**
 * @desc    Get a single quest by ID
 * @route   GET /api/quests/:id
 * @access  Private (JWT)
 */
const getQuestById = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    const quest = await Quest.findById(req.params.id).populate('goalId', 'title category difficulty progress');

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    // Verify ownership
    if (quest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this quest.'
      });
    }

    return res.status(200).json({
      success: true,
      quest
    });
  } catch (error) {
    console.error('❌ [getQuestById error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve quest details'
    });
  }
};

/**
 * @desc    Update an existing quest
 * @route   PUT /api/quests/:id
 * @access  Private (JWT)
 */
const updateQuest = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    // Verify ownership
    if (quest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to modify this quest.'
      });
    }

    const { title, description, difficulty, xpReward, dueDate, goalId } = req.body;

    if (title !== undefined) {
      if (!title.trim() || title.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Quest title must be at least 2 characters long'
        });
      }
      quest.title = title.trim();
    }

    if (description !== undefined) {
      quest.description = description.trim();
    }

    if (difficulty !== undefined) {
      const allowed = ['Easy', 'Medium', 'Hard'];
      if (allowed.includes(difficulty)) {
        quest.difficulty = difficulty;
      }
    }

    if (xpReward !== undefined) {
      const numXp = Number(xpReward);
      if (isNaN(numXp) || numXp <= 0) {
        return res.status(400).json({
          success: false,
          message: 'XP reward must be a positive number'
        });
      }
      quest.xpReward = numXp;
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') {
        quest.dueDate = null;
      } else {
        const d = new Date(dueDate);
        if (isNaN(d.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid due date format'
          });
        }
        quest.dueDate = d;
      }
    }

    // Verify goal ownership if goalId updated
    if (goalId !== undefined) {
      if (goalId === null || goalId === '' || goalId === 'none') {
        quest.goalId = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(goalId)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid Goal ID format'
          });
        }
        const goal = await Goal.findById(goalId);
        if (!goal || goal.user.toString() !== req.user._id.toString()) {
          return res.status(400).json({
            success: false,
            message: 'Specified Goal does not exist or does not belong to user'
          });
        }
        quest.goalId = goal._id;
      }
    }

    const updatedQuest = await quest.save();
    if (updatedQuest.goalId) {
      await updatedQuest.populate('goalId', 'title category difficulty progress');
    }

    return res.status(200).json({
      success: true,
      message: 'Quest updated successfully',
      quest: updatedQuest
    });
  } catch (error) {
    console.error('❌ [updateQuest error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update quest'
    });
  }
};

/**
 * @desc    Complete a quest, award XP to user once
 * @route   PATCH /api/quests/:id/complete
 * @access  Private (JWT)
 */
const completeQuest = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    // Verify ownership
    if (quest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to complete this quest.'
      });
    }

    // Prevent duplicate completion and duplicate XP award
    if (quest.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Quest is already completed. XP reward was already claimed.',
        quest
      });
    }

    // 1. Mark quest completed
    quest.status = 'completed';
    quest.completedAt = new Date();
    await quest.save();

    // 2. Award XP to user and calculate new level
    const user = await User.findById(req.user._id);
    let updatedXp = 0;
    let updatedLevel = 1;
    let leveledUp = false;

    if (user) {
      const oldLevel = user.level || Math.floor((user.xp || 0) / 500) + 1;
      user.xp = (user.xp || 0) + quest.xpReward;
      // Simple and compatible level logic: 500 XP per level
      user.level = Math.floor(user.xp / 500) + 1;
      await user.save();
      updatedXp = user.xp;
      updatedLevel = user.level;
      if (updatedLevel > oldLevel) {
        leveledUp = true;
      }
    }

    // 3. Dispatch Quest Completed Notification
    createNotification({
      userId: req.user._id,
      type: 'quest',
      title: `Quest Completed: “${quest.title}”`,
      message: `You completed "${quest.title}" and claimed +${quest.xpReward} XP!`,
      relatedId: quest._id
    });

    // 4. Dispatch Level-Up Achievement Notification if applicable
    if (leveledUp) {
      createNotification({
        userId: req.user._id,
        type: 'achievement',
        title: `Level Up Achieved: Level ${updatedLevel}`,
        message: `Congratulations! Your character advanced to Level ${updatedLevel} Champion!`,
        relatedId: req.user._id
      });
    }

    // 5. Evaluate achievements unlock (quest counts, XP thresholds)
    checkAndUnlockAchievements(req.user._id).catch(() => {});

    if (quest.goalId) {
      await quest.populate('goalId', 'title category difficulty progress');
    }

    return res.status(200).json({
      success: true,
      message: `Quest completed! +${quest.xpReward} XP awarded!`,
      quest,
      user: {
        xp: updatedXp,
        level: updatedLevel
      }
    });
  } catch (error) {
    console.error('❌ [completeQuest error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete quest'
    });
  }
};

/**
 * @desc    Delete a quest
 * @route   DELETE /api/quests/:id
 * @access  Private (JWT)
 */
const deleteQuest = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    // Verify ownership
    if (quest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to delete this quest.'
      });
    }

    await quest.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Quest deleted successfully'
    });
  } catch (error) {
    console.error('❌ [deleteQuest error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete quest'
    });
  }
};

module.exports = {
  createQuest,
  getMyQuests,
  getQuestById,
  updateQuest,
  completeQuest,
  deleteQuest
};
