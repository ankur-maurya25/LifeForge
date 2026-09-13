const https = require('https');
const http = require('http');
const Goal = require('../models/Goal');
const Quest = require('../models/Quest');
const DailyChallenge = require('../models/DailyChallenge');
const User = require('../models/User');
const UserAchievement = require('../models/UserAchievement');

/**
 * Gather sanitized user progress context for the AI Life Coach
 * Strictly no passwords, tokens, or private emails
 */
async function getUserCoachContext(userId) {
  try {
    const user = await User.findById(userId).select('name username level xp streak longestStreak');
    if (!user) return null;

    const [goals, quests, todayChallenge, achievementsCount] = await Promise.all([
      Goal.find({ user: userId }).select('title category difficulty status progress milestones').lean(),
      Quest.find({ userId }).select('title difficulty xpReward status dueDate completedAt').sort({ createdAt: -1 }).limit(15).lean(),
      DailyChallenge.findOne({
        userId,
        challengeDate: new Date().toISOString().split('T')[0]
      }).select('title difficulty xpReward status').lean(),
      UserAchievement.countDocuments({ userId })
    ]);

    const activeGoals = goals.filter((g) => g.status === 'active' || (g.progress || 0) < 100);
    const completedGoals = goals.filter((g) => g.status === 'completed' || (g.progress || 0) >= 100);

    const pendingQuests = quests.filter((q) => q.status === 'pending');
    const completedQuests = quests.filter((q) => q.status === 'completed');

    // Boss calculation: first active goal acts as current boss
    const activeBoss = activeGoals.length > 0 ? {
      name: activeGoals[0].title,
      category: activeGoals[0].category,
      hpRemaining: Math.max(0, 100 - (activeGoals[0].progress || 0)),
      difficulty: activeGoals[0].difficulty
    } : null;

    const userLevel = user.level || Math.floor((user.xp || 0) / 500) + 1;
    const nextLevelTargetXp = userLevel * 500;
    const xpIntoLevel = Math.max(0, (user.xp || 0) - (userLevel - 1) * 500);

    return {
      heroName: user.name || user.username || 'Adventurer',
      level: userLevel,
      totalXp: user.xp || 0,
      xpIntoLevel,
      xpNeededForNextLevel: 500 - xpIntoLevel,
      nextLevelTargetXp,
      streak: user.streak || 0,
      longestStreak: user.longestStreak || user.streak || 0,
      totalGoals: goals.length,
      activeGoalsCount: activeGoals.length,
      activeGoals: activeGoals.slice(0, 3).map((g) => ({
        id: g._id,
        title: g.title,
        category: g.category,
        progress: g.progress || 0
      })),
      completedGoalsCount: completedGoals.length,
      totalQuests: quests.length,
      pendingQuestsCount: pendingQuests.length,
      pendingQuests: pendingQuests.slice(0, 5).map((q) => ({
        id: q._id,
        title: q.title,
        difficulty: q.difficulty,
        xpReward: q.xpReward
      })),
      completedQuestsCount: completedQuests.length,
      dailyChallengeStatus: todayChallenge ? {
        title: todayChallenge.title,
        difficulty: todayChallenge.difficulty,
        completed: todayChallenge.status === 'completed',
        xpReward: todayChallenge.xpReward
      } : { status: 'none_generated_yet' },
      activeBoss,
      unlockedAchievementsCount: achievementsCount
    };
  } catch (err) {
    console.error('❌ [getUserCoachContext error]:', err.message);
    return null;
  }
}

/**
 * Generate smart rule-based recommendations tailored to real database state
 */
function generateRuleBasedRecommendations(context) {
  const recommendations = [];

  if (!context) {
    return [
      {
        id: 'rec_general_focus',
        title: 'Awaken Your Forge',
        description: 'Set your primary focus objective for today and convert intent into action.',
        priority: 'high',
        category: 'general',
        actionLabel: 'Create Goal',
        actionRoute: '/create-goal'
      }
    ];
  }

  // 1. If user has no goals
  if (context.totalGoals === 0) {
    recommendations.push({
      id: 'rec_no_goals',
      title: 'Awaken Your First Campaign Boss',
      description: 'You have not forged any goals yet. Create a campaign goal to begin your RPG progression.',
      priority: 'urgent',
      category: 'goal',
      actionLabel: 'Forge First Goal',
      actionRoute: '/create-goal'
    });
  }

  // 2. If active boss exists
  if (context.activeBoss) {
    recommendations.push({
      id: 'rec_boss_strike',
      title: `Strike Campaign Boss: "${context.activeBoss.name}"`,
      description: `The boss has ${context.activeBoss.hpRemaining}% HP remaining. Complete quests to inflict massive damage!`,
      priority: 'high',
      category: 'boss',
      actionLabel: 'Enter Boss Battle',
      actionRoute: '/boss-battle'
    });
  }

  // 3. If many pending quests exist
  if (context.pendingQuestsCount > 0) {
    const easiest = context.pendingQuests.find((q) => q.difficulty === 'Easy') || context.pendingQuests[0];
    recommendations.push({
      id: 'rec_quick_win',
      title: `Quick Win: Clear "${easiest.title}"`,
      description: `You have ${context.pendingQuestsCount} pending quests. Knock out this ${easiest.difficulty} quest to claim +${easiest.xpReward} XP.`,
      priority: 'high',
      category: 'quest',
      actionLabel: 'View Quests',
      actionRoute: '/quests',
      relatedQuestId: easiest.id
    });
  } else if (context.totalGoals > 0 && context.pendingQuestsCount === 0) {
    recommendations.push({
      id: 'rec_create_quests',
      title: 'Deconstruct Your Goals into Quests',
      description: 'No active quests are pending. Add 1-2 bite-sized daily combat objectives to keep momentum.',
      priority: 'medium',
      category: 'quest',
      actionLabel: 'Manage Quests',
      actionRoute: '/quests'
    });
  }

  // 4. Daily challenge check
  if (!context.dailyChallengeStatus || context.dailyChallengeStatus.status === 'none_generated_yet' || !context.dailyChallengeStatus.completed) {
    recommendations.push({
      id: 'rec_daily_bounty',
      title: 'Conquer Today’s Bounty',
      description: 'Complete today’s daily challenge bounty to protect and advance your streak.',
      priority: 'medium',
      category: 'challenge',
      actionLabel: 'Daily Challenge',
      actionRoute: '/daily-challenge'
    });
  }

  // 5. Streak advice
  if (context.streak === 0) {
    recommendations.push({
      id: 'rec_ignite_streak',
      title: 'Ignite Your Streak Flame',
      description: 'Your streak flame is dormant. Complete one quest or daily bounty today to ignite Day 1.',
      priority: 'medium',
      category: 'streak',
      actionLabel: 'Daily Bounty',
      actionRoute: '/daily-challenge'
    });
  } else if (context.streak >= 3) {
    recommendations.push({
      id: 'rec_streak_glory',
      title: `Protect Your ${context.streak}-Day Momentum`,
      description: `Unstoppable! You are on a ${context.streak}-day streak. Keep the streak active to unlock legendary trophies.`,
      priority: 'low',
      category: 'streak',
      actionLabel: 'Leaderboard Rank',
      actionRoute: '/leaderboard'
    });
  }

  // 6. Level XP advice
  recommendations.push({
    id: 'rec_level_target',
    title: `Level ${context.level + 1} Target: ${context.xpNeededForNextLevel} XP Needed`,
    description: `You have amassed ${context.totalXp} XP. Earn ${context.xpNeededForNextLevel} more XP through quests to reach Level ${context.level + 1}.`,
    priority: 'low',
    category: 'level',
    actionLabel: 'Character Profile',
    actionRoute: '/character'
  });

  return recommendations;
}

/**
 * Generate an intelligent RPG Life Coach response using rule-based contextual reasoning
 * or external AI API if configured
 */
async function generateCoachChatResponse(userPrompt, context) {
  const promptLower = (userPrompt || '').toLowerCase().trim();
  const apiKey = process.env.AI_COACH_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  // If external provider key is present, attempt call, else fall back gracefully
  if (apiKey) {
    try {
      const externalAiReply = await callExternalAiProvider(userPrompt, context, apiKey);
      if (externalAiReply) {
        return externalAiReply;
      }
    } catch (apiErr) {
      console.warn('⚠️ [aiCoachService] External AI provider failed, using safe RPG reasoning fallback:', apiErr.message);
    }
  }

  // Robust, concise, practical RPG-themed response engine
  return generateContextualRpgResponse(promptLower, context);
}

/**
 * Context-aware RPG response generator
 */
function generateContextualRpgResponse(prompt, context) {
  const hero = context?.heroName || 'Adventurer';
  const level = context?.level || 1;
  const pendingCount = context?.pendingQuestsCount || 0;
  const streak = context?.streak || 0;
  const activeBoss = context?.activeBoss;
  const xpNeeded = context?.xpNeededForNextLevel || 250;

  // 1. "What should I do / focus on today?"
  if (prompt.includes('today') || prompt.includes('focus') || prompt.includes('what should i do')) {
    let focusMsg = `Greetings, Champion ${hero}! Looking across the battle map for today:\n\n`;
    if (pendingCount > 0) {
      const topQuest = context.pendingQuests[0];
      focusMsg += `⚔️ **Primary Strike:** Complete quest **"${topQuest.title}"** (+${topQuest.xpReward} XP).\n`;
    } else if (context?.totalGoals === 0) {
      focusMsg += `📜 **Primary Strike:** You have no campaign forged yet. Create your first Goal to summon a Nemesis Boss.\n`;
    } else {
      focusMsg += `🎯 **Primary Strike:** Draft 2 fresh tactical quests for your active campaign.\n`;
    }

    if (activeBoss) {
      focusMsg += `🐉 **Boss Alert:** "${activeBoss.name}" stands at ${activeBoss.hpRemaining}% HP. Every quest completed inflicts critical damage!\n`;
    }

    if (!context?.dailyChallengeStatus?.completed) {
      focusMsg += `⚡ **Daily Bounty:** Knock out today’s Daily Challenge to safeguard your ${streak}-day streak flame.`;
    } else {
      focusMsg += `🔥 **Streak Status:** Today's bounty is secured! Momentum is on your side.`;
    }

    return {
      message: focusMsg,
      suggestions: ['Suggest a quest', 'How to defeat the boss?', 'How to improve streak?'],
      relatedGoalId: activeBoss ? context.activeGoals[0]?.id : null,
      relatedQuestId: pendingCount > 0 ? context.pendingQuests[0]?.id : null
    };
  }

  // 2. "Suggest quests / suggest a quest"
  if (prompt.includes('quest') || prompt.includes('suggest')) {
    if (pendingCount > 0) {
      const topQuest = context.pendingQuests[0];
      return {
        message: `Hail, ${hero}! You already have **${pendingCount} pending quests** ready for execution.\n\nI recommend tackling: **"${topQuest.title}"** (${topQuest.difficulty} difficulty, +${topQuest.xpReward} XP).\n\nBreak it down into a 25-minute Pomodoro sprint. Once done, claim your reward in the Quest Board!`,
        suggestions: ['What should I do today?', 'Motivate me', 'Next level target'],
        relatedQuestId: topQuest.id
      };
    }

    return {
      message: `No pending quests found on your board, ${hero}! Here are 3 recommended quests to forge today:\n\n1. **Deep Work Sprint (45m):** Focus strictly on your highest-leverage goal without notifications (+100 XP).\n2. **System Review & Planning (15m):** Outline tomorrow's 3 essential milestones (+50 XP).\n3. **Vitality Restoration (20m):** Ergonomic stretching, hydration, or a brisk walk (+30 XP).`,
      suggestions: ['Go to Quest Board', 'What should I do today?', 'Help me complete my goals']
    };
  }

  // 3. "Help me complete goals / which goal to prioritize"
  if (prompt.includes('goal') || prompt.includes('prioritize')) {
    if (!context || context.activeGoalsCount === 0) {
      return {
        message: `You currently have no active campaign goals, ${hero}!\n\nTo begin, navigate to **Create Goal** and forge a specific ambition (e.g. Master React, Build Portfolio, Daily Fitness). LifeForge will decompose it into milestone bosses and actionable quests.`,
        suggestions: ['Create Goal', 'What should I do today?', 'Motivate me']
      };
    }

    const mainGoal = context.activeGoals[0];
    return {
      message: `⚔️ **Campaign Priority:** Prioritize **"${mainGoal.title}"** (Category: ${mainGoal.category}, Progress: ${mainGoal.progress}%).\n\n**Winning Strategy:**\n• Never fight on multiple fronts simultaneously. Commit to 1 primary milestone this week.\n• Convert large tasks into sub-tasks with < 60 minutes duration.\n• Reaching 100% completion will vanquish the campaign Nemesis and award massive XP!`,
      suggestions: ['Suggest a quest for this goal', 'What should I do today?', 'How to improve streak?'],
      relatedGoalId: mainGoal.id
    };
  }

  // 4. "How can I improve my streak?"
  if (prompt.includes('streak') || prompt.includes('routine') || prompt.includes('habit')) {
    return {
      message: `🔥 **Current Streak: ${streak} Days (Record: ${context?.longestStreak || streak} Days)**\n\n**The Iron Discipline Rulebook:**\n1. **Never Miss Twice:** If fatigue strikes, complete just 1 micro-quest (e.g. 5 minutes of study or hydration) to keep the flame alive.\n2. **Daily Bounty Anchor:** Clear the Daily Challenge right after your morning coffee.\n3. **Evening Check-in:** Review completed quests before sleeping to lock in momentum.`,
      suggestions: ['View Daily Challenge', 'What should I do today?', 'Motivate me']
    };
  }

  // 5. "Motivate me / encouragement"
  if (prompt.includes('motivate') || prompt.includes('tired') || prompt.includes('procrastinat') || prompt.includes('inspire')) {
    return {
      message: `Stand tall, ${hero}! Every legendary champion in the realm started at Level 1 with empty inventory and impossible odds.\n\nYou have already gained **${context?.totalXp || 0} XP** and conquered **${context?.completedQuestsCount || 0} quests**.\n\nProcrastination is merely a phantom boss feeding on doubt. Do not try to win the entire war right now — just clear **one single quest** in the next 15 minutes. Draw your blade!`,
      suggestions: ['What should I do today?', 'Suggest a quest', 'Protect my streak']
    };
  }

  // 6. Default general coach response
  return {
    message: `Greetings, Level ${level} ${hero}! As your LifeForge AI Tactical Coach, I stand ready to guide your conquest.\n\nYou currently have **${pendingCount} pending quests**, a **${streak}-day streak**, and need **${xpNeeded} XP** to reach Level ${level + 1}.\n\nHow may I assist your strategy today?`,
    suggestions: [
      'What should I do today?',
      'Help me complete my goals',
      'Suggest a quest',
      'How can I improve my streak?',
      'Motivate me'
    ]
  };
}

/**
 * Optional HTTP call to external LLM provider if API key is provided in .env
 */
async function callExternalAiProvider(prompt, context, apiKey) {
  // If user configured OPENAI_API_KEY
  if (process.env.OPENAI_API_KEY) {
    const systemPrompt = `You are the LifeForge AI Life Coach in a dark fantasy RPG productivity app.
The user is a hero named ${context?.heroName || 'Adventurer'} (Level ${context?.level || 1}, Total XP: ${context?.totalXp || 0}, Streak: ${context?.streak || 0} days).
Pending Quests: ${context?.pendingQuestsCount || 0}, Active Goals: ${context?.activeGoalsCount || 0}.
Keep your advice concise (2-4 paragraphs max), practical, action-oriented, and infused with subtle RPG flavor (striking bosses, forging momentum, quests).`;

    const payload = JSON.stringify({
      model: process.env.AI_COACH_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 450,
      temperature: 0.7
    });

    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 8000
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
              resolve({
                message: reply.trim(),
                suggestions: ['What should I do today?', 'Help me complete my goals', 'Suggest a quest']
              });
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });

      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
      req.write(payload);
      req.end();
    });
  }

  return null;
}

module.exports = {
  getUserCoachContext,
  generateRuleBasedRecommendations,
  generateCoachChatResponse
};
