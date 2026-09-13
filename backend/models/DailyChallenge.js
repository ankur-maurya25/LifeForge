const mongoose = require('mongoose');

/**
 * Daily Challenge Schema
 * One challenge per user per day.
 */
const DailyChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Daily challenge must belong to a user']
    },
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true,
      maxlength: [140, 'Title cannot exceed 140 characters']
    },
    description: {
      type: String,
      required: [true, 'Challenge description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
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
      default: 50
    },
    challengeDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Challenge date is required']
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
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

// Ensure one daily challenge per user per date
DailyChallengeSchema.index({ userId: 1, challengeDate: 1 }, { unique: true });

module.exports = mongoose.model('DailyChallenge', DailyChallengeSchema);
