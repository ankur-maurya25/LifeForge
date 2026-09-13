const mongoose = require('mongoose');

/**
 * Milestone Sub-schema
 * Represents individual checkpoints or chapters within a Goal
 */
const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
    trim: true,
    maxlength: [120, 'Milestone title cannot exceed 120 characters']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  xpReward: {
    type: Number,
    default: 50,
    min: 0
  }
});

/**
 * Goal Schema
 * Connects user ambition to RPG boss campaigns
 */
const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Goal must be associated with a user']
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      minlength: [3, 'Goal title must be at least 3 characters'],
      maxlength: [100, 'Goal title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Goal description cannot exceed 500 characters']
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Epic', 'Legendary'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    milestones: [MilestoneSchema]
  },
  {
    timestamps: true
  }
);

// Index for high-performance lookup of user goals
GoalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Goal', GoalSchema);
