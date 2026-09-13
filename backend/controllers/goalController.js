const mongoose = require('mongoose');
const Goal = require('../models/Goal');
const { createNotification } = require('../utils/notificationService');
const { checkAndUnlockAchievements } = require('../utils/achievementService');

/**
 * Check if MongoDB connection is established
 */
const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Unable to load goals. Please start the backend database (MongoDB).'
    });
    return false;
  }
  return true;
};

/**
 * Helper to generate 4 demo milestones tailored to the goal
 */
const generateDefaultMilestones = (goalTitle) => {
  return [
    {
      title: 'Phase 1: Foundation & Strategy',
      description: `Establish initial habits, environment, and core syllabus for "${goalTitle}".`,
      completed: false,
      progress: 0,
      xpReward: 50
    },
    {
      title: 'Phase 2: Core Execution & Practice',
      description: `Maintain daily deep work focus sessions to build momentum on "${goalTitle}".`,
      completed: false,
      progress: 0,
      xpReward: 100
    },
    {
      title: 'Phase 3: Advanced Challenges & Testing',
      description: 'Tackle complex real-world projects, problem solving, and skill application.',
      completed: false,
      progress: 0,
      xpReward: 150
    },
    {
      title: 'Phase 4: Boss Conquest & Mastery',
      description: 'Complete final capstone review, verify outcomes, and claim total victory.',
      completed: false,
      progress: 0,
      xpReward: 200
    }
  ];
};

/**
 * @desc    Create a new Goal with automated milestones
 * @route   POST /api/goals
 * @access  Private (JWT)
 */
const createGoal = async (req, res) => {
  if (!checkDbConnection(res)) return;
  try {
    const { title, description, category, difficulty } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Goal title is required'
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Goal title must be at least 3 characters long'
      });
    }

    // Auto-generate 4 demo milestones
    const milestones = generateDefaultMilestones(title.trim());

    // Create Goal document
    const goal = await Goal.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category ? category.trim() : 'General',
      difficulty: difficulty || 'Medium',
      status: 'active',
      progress: 0,
      milestones
    });

    // Dispatch Goal Forged Notification
    createNotification({
      userId: req.user._id,
      type: 'goal',
      title: `Goal Forged: “${goal.title}”`,
      message: `You awakened the campaign "${goal.title}" in category ${goal.category}.`,
      relatedId: goal._id
    });

    // Check achievements (e.g. 1st goal created)
    checkAndUnlockAchievements(req.user._id).catch(() => {});

    return res.status(201).json({
      success: true,
      message: 'Goal forged successfully',
      goal
    });
  } catch (error) {
    console.error('❌ [createGoal error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create goal'
    });
  }
};

/**
 * @desc    Get all goals for the logged-in user
 * @route   GET /api/goals
 * @access  Private (JWT)
 */
const getMyGoals = async (req, res) => {
  if (!checkDbConnection(res)) return;
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: goals.length,
      goals
    });
  } catch (error) {
    console.error('❌ [getMyGoals error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve goals'
    });
  }
};

/**
 * @desc    Get a single goal by ID (Ownership protected)
 * @route   GET /api/goals/:id
 * @access  Private (JWT)
 */
const getGoalById = async (req, res) => {
  if (!checkDbConnection(res)) return;
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Verify ownership
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this goal.'
      });
    }

    return res.status(200).json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('❌ [getGoalById error]:', error.message);
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Goal not found with provided ID'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve goal details'
    });
  }
};

/**
 * @desc    Update an existing goal (Ownership protected)
 * @route   PUT /api/goals/:id
 * @access  Private (JWT)
 */
const updateGoal = async (req, res) => {
  if (!checkDbConnection(res)) return;
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Verify ownership
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to modify this goal.'
      });
    }

    const wasCompleted = goal.status === 'completed' || (goal.progress || 0) >= 100;

    const { title, description, category, difficulty, status, progress, milestones } = req.body;

    if (title !== undefined) goal.title = title.trim();
    if (description !== undefined) goal.description = description.trim();
    if (category !== undefined) goal.category = category.trim();
    if (difficulty !== undefined) goal.difficulty = difficulty;
    if (status !== undefined) goal.status = status;
    if (progress !== undefined) goal.progress = Number(progress);
    if (milestones !== undefined && Array.isArray(milestones)) goal.milestones = milestones;

    const updatedGoal = await goal.save();

    const isNowCompleted = updatedGoal.status === 'completed' || (updatedGoal.progress || 0) >= 100;

    if (!wasCompleted && isNowCompleted) {
      // 1. Goal Completed Notification
      createNotification({
        userId: req.user._id,
        type: 'goal',
        title: `Campaign Conquered: “${updatedGoal.title}”`,
        message: `All milestones reached! You successfully conquered "${updatedGoal.title}".`,
        relatedId: updatedGoal._id
      });

      // 2. Boss Defeated Notification
      createNotification({
        userId: req.user._id,
        type: 'boss',
        title: `Boss Defeated: ${updatedGoal.title} Nemesis`,
        message: `The realm celebrates! The boss of campaign "${updatedGoal.title}" has been vanquished!`,
        relatedId: updatedGoal._id
      });

      // 3. Trigger achievement check (1st boss / 3 bosses / goal completed)
      checkAndUnlockAchievements(req.user._id).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      goal: updatedGoal
    });
  } catch (error) {
    console.error('❌ [updateGoal error]:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Goal not found with provided ID'
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update goal'
    });
  }
};

/**
 * @desc    Delete a goal (Ownership protected)
 * @route   DELETE /api/goals/:id
 * @access  Private (JWT)
 */
const deleteGoal = async (req, res) => {
  if (!checkDbConnection(res)) return;
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Verify ownership
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to delete this goal.'
      });
    }

    await goal.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('❌ [deleteGoal error]:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Goal not found with provided ID'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to delete goal'
    });
  }
};

module.exports = {
  createGoal,
  getMyGoals,
  getGoalById,
  updateGoal,
  deleteGoal
};
