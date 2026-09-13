const mongoose = require('mongoose');

/**
 * Quest Schema
 * Represents daily and campaign quests tied to an authenticated user and optionally a Goal
 */
const QuestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Quest must be associated with a user']
    },
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      default: null
    },
    title: {
      type: String,
      required: [true, 'Quest title is required'],
      trim: true,
      minlength: [2, 'Quest title must be at least 2 characters long'],
      maxlength: [140, 'Quest title cannot exceed 140 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Quest description cannot exceed 500 characters']
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    xpReward: {
      type: Number,
      required: [true, 'XP reward is required'],
      min: [1, 'XP reward must be at least 1'],
      default: 40
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    dueDate: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// High performance compound indexes for user queries
QuestSchema.index({ userId: 1, status: 1, createdAt: -1 });
QuestSchema.index({ goalId: 1 });

module.exports = mongoose.model('Quest', QuestSchema);
