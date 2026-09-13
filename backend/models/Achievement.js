const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Achievement description is required'],
      trim: true
    },
    icon: {
      type: String,
      default: '🏆'
    },
    category: {
      type: String,
      required: true,
      enum: ['quest', 'goal', 'streak', 'xp', 'boss', 'challenge', 'social'],
      default: 'quest'
    },
    requirementType: {
      type: String,
      required: true,
      enum: [
        'completed_quests',
        'created_goals',
        'completed_goals',
        'streak_days',
        'total_xp',
        'defeated_bosses',
        'completed_challenges',
        'friends_count'
      ]
    },
    requirementValue: {
      type: Number,
      required: [true, 'Requirement value is required'],
      min: [1, 'Requirement value must be at least 1']
    },
    xpReward: {
      type: Number,
      required: true,
      default: 100,
      min: [0, 'XP reward cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

achievementSchema.index({ category: 1, isActive: 1 });
achievementSchema.index({ requirementType: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
