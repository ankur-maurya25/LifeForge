const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Quest = require('../models/Quest');
const DailyChallenge = require('../models/DailyChallenge');
const Friendship = require('../models/Friendship');
const { createNotification } = require('./notificationService');

const DEFAULT_ACHIEVEMENTS = [
  {
    title: 'First Blood: Quest Begun',
    description: 'Complete your first productivity quest to strike the first blow.',
    icon: '⚔️',
    category: 'quest',
    requirementType: 'completed_quests',
    requirementValue: 1,
    xpReward: 100
  },
  {
    title: 'Quest Novice',
    description: 'Complete 10 quests across your heroic journey.',
    icon: '🗡️',
    category: 'quest',
    requirementType: 'completed_quests',
    requirementValue: 10,
    xpReward: 250
  },
  {
    title: 'Quest Master',
    description: 'Complete 50 productivity quests and forge unbreakable discipline.',
    icon: '🛡️',
    category: 'quest',
    requirementType: 'completed_quests',
    requirementValue: 50,
    xpReward: 1000
  },
  {
    title: 'Architect of Ambition',
    description: 'Create your very first campaign goal in LifeForge.',
    icon: '📜',
    category: 'goal',
    requirementType: 'created_goals',
    requirementValue: 1,
    xpReward: 100
  },
  {
    title: 'Slayer of Doubt: First Boss',
    description: 'Complete your first goal and defeat a campaign Nemesis.',
    icon: '🏆',
    category: 'boss',
    requirementType: 'completed_goals',
    requirementValue: 1,
    xpReward: 500
  },
  {
    title: 'Demon Bane',
    description: 'Vanquish 3 campaign bosses by reaching 100% completion.',
    icon: '👑',
    category: 'boss',
    requirementType: 'completed_goals',
    requirementValue: 3,
    xpReward: 1500
  },
  {
    title: 'Sparks of Momentum',
    description: 'Maintain a 3-day active streak without missing daily bounties.',
    icon: '🔥',
    category: 'streak',
    requirementType: 'streak_days',
    requirementValue: 3,
    xpReward: 150
  },
  {
    title: 'Iron Will: 7-Day Streak',
    description: 'Reach a 7-day unbroken productivity streak.',
    icon: '⚡',
    category: 'streak',
    requirementType: 'streak_days',
    requirementValue: 7,
    xpReward: 350
  },
  {
    title: 'Century of Power',
    description: 'Amass 100 total XP throughout your heroic conquests.',
    icon: '✨',
    category: 'xp',
    requirementType: 'total_xp',
    requirementValue: 100,
    xpReward: 100
  },
  {
    title: 'Apex Vanguard: 500 XP',
    description: 'Cross 500 total XP and rise to Level 2 and beyond.',
    icon: '🌟',
    category: 'xp',
    requirementType: 'total_xp',
    requirementValue: 500,
    xpReward: 250
  },
  {
    title: 'Daily Bounty Hunter',
    description: 'Complete your first daily challenge bounty.',
    icon: '🎯',
    category: 'challenge',
    requirementType: 'completed_challenges',
    requirementValue: 1,
    xpReward: 150
  },
  {
    title: 'Fellowship of the Forge',
    description: 'Forge an alliance with your first friend in LifeForge.',
    icon: '🤝',
    category: 'social',
    requirementType: 'friends_count',
    requirementValue: 1,
    xpReward: 100
  }
];

async function seedDefaultAchievements() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    for (const item of DEFAULT_ACHIEVEMENTS) {
      await Achievement.findOneAndUpdate(
        { title: item.title },
        { $setOnInsert: item },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error('❌ [seedDefaultAchievements error]:', err.message);
  }
}

async function getUserMetricMap(userId) {
  const user = await User.findById(userId);
  if (!user) return null;

  const [
    completedQuestsCount,
    createdGoalsCount,
    completedGoalsCount,
    completedChallengesCount,
    friendsCount
  ] = await Promise.all([
    Quest.countDocuments({ userId, status: 'completed' }),
    Goal.countDocuments({ user: userId }),
    Goal.countDocuments({ user: userId, status: 'completed' }),
    DailyChallenge.countDocuments({ userId, status: 'completed' }),
    Friendship.countDocuments({
      $or: [{ user1: userId }, { user2: userId }]
    })
  ]);

  const streakDays = Math.max(user.streak || 0, user.longestStreak || 0);
  const totalXp = user.xp || 0;

  return {
    completed_quests: completedQuestsCount,
    created_goals: createdGoalsCount,
    completed_goals: completedGoalsCount,
    defeated_bosses: completedGoalsCount,
    streak_days: streakDays,
    total_xp: totalXp,
    completed_challenges: completedChallengesCount,
    friends_count: friendsCount
  };
}

async function checkAndUnlockAchievements(userId) {
  if (!userId || mongoose.connection.readyState !== 1) return [];

  try {
    await seedDefaultAchievements();
    const metrics = await getUserMetricMap(userId);
    if (!metrics) return [];

    const allAchievements = await Achievement.find({ isActive: true });
    const existingUserAchievements = await UserAchievement.find({ userId });
    const unlockedMap = new Set(
      existingUserAchievements.map((ua) => ua.achievementId.toString())
    );

    const newlyUnlocked = [];

    for (const ach of allAchievements) {
      if (unlockedMap.has(ach._id.toString())) {
        continue;
      }

      const userVal = metrics[ach.requirementType] ?? 0;
      if (userVal >= ach.requirementValue) {
        try {
          const userAch = await UserAchievement.create({
            userId,
            achievementId: ach._id,
            unlockedAt: new Date(),
            rewardClaimed: false
          });

          newlyUnlocked.push({
            achievement: ach,
            userAchievement: userAch
          });

          createNotification({
            userId,
            type: 'achievement',
            title: 'Achievement Unlocked: ' + ach.icon + ' ' + ach.title,
            message: 'Heroic feat achieved! You unlocked "' + ach.title + '". Claim your +' + ach.xpReward + ' XP reward!',
            relatedId: ach._id
          });
        } catch (insertErr) {
          if (insertErr.code !== 11000) {
            console.error('Error inserting UserAchievement:', insertErr.message);
          }
        }
      }
    }

    return newlyUnlocked;
  } catch (err) {
    console.error('❌ [checkAndUnlockAchievements error]:', err.message);
    return [];
  }
}

async function getAllAchievementsWithProgress(userId) {
  if (mongoose.connection.readyState !== 1) return [];

  await seedDefaultAchievements();

  const [metrics, allAchievements, userAchievements] = await Promise.all([
    getUserMetricMap(userId) || {},
    Achievement.find({ isActive: true }).sort({ createdAt: 1 }),
    UserAchievement.find({ userId })
  ]);

  const unlockedMap = new Map();
  userAchievements.forEach((ua) => {
    unlockedMap.set(ua.achievementId.toString(), ua);
  });

  return allAchievements.map((ach) => {
    const achIdStr = ach._id.toString();
    const userAch = unlockedMap.get(achIdStr);
    const currentValue = metrics[ach.requirementType] ?? 0;
    const isUnlocked = !!userAch;
    const progressPercent = Math.min(
      100,
      Math.round((Math.min(currentValue, ach.requirementValue) / ach.requirementValue) * 100)
    );

    return {
      _id: ach._id,
      title: ach.title,
      description: ach.description,
      icon: ach.icon,
      category: ach.category,
      requirementType: ach.requirementType,
      requirementValue: ach.requirementValue,
      currentValue,
      progressPercent,
      xpReward: ach.xpReward,
      isUnlocked,
      unlockedAt: userAch ? userAch.unlockedAt : null,
      rewardClaimed: userAch ? userAch.rewardClaimed : false,
      userAchievementId: userAch ? userAch._id : null
    };
  });
}

module.exports = {
  DEFAULT_ACHIEVEMENTS,
  seedDefaultAchievements,
  getUserMetricMap,
  checkAndUnlockAchievements,
  getAllAchievementsWithProgress
};