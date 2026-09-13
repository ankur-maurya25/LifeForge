const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: [true, 'Achievement ID is required']
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    rewardClaimed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate achievement unlocks for a user
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, rewardClaimed: 1 });

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
