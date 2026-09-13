import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getGoals,
  getQuests,
  completeQuest,
  getTodayChallenge,
  getMyLeaderboardRank,
  getLeaderboardStats,
  getFriends,
  getFriendRequests,
  getAnalyticsOverview,
  getUnreadNotificationsCount,
  getNotifications,
  getAchievementProgress,
  getAiRecommendations
} from '../services/api';
import PlayerOverview from '../components/dashboard/PlayerOverview';
import BossCard from '../components/dashboard/BossCard';
import QuestCard from '../components/dashboard/QuestCard';
import StatCard from '../components/dashboard/StatCard';
import SkillProgress from '../components/dashboard/SkillProgress';
import ActivityList from '../components/dashboard/ActivityList';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();
  const [bossHp, setBossHp] = useState(72);
  const [playerXp, setPlayerXp] = useState(640);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [demoNotice, setDemoNotice] = useState('');

  // Real backend Goals state
  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [goalsError, setGoalsError] = useState('');

  // Real backend Quests state
  const [quests, setQuests] = useState([]);
  const [loadingQuests, setLoadingQuests] = useState(true);
  const [questsError, setQuestsError] = useState('');

  // Real backend Daily Challenge state
  const [todayChallenge, setTodayChallenge] = useState(null);

  // Real backend Leaderboard state
  const [leaderboardInfo, setLeaderboardInfo] = useState({
    userRank: 1,
    topUser: null,
    totalUsers: 1
  });

  // Real backend Friends state
  const [friendsSummary, setFriendsSummary] = useState({
    count: 0,
    pendingRequests: 0
  });

  // Real backend Analytics state
  const [analyticsOverview, setAnalyticsOverview] = useState(null);

  // Real backend Notifications state
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [latestNotif, setLatestNotif] = useState(null);

  // Real backend Achievement state
  const [achievementStats, setAchievementStats] = useState({
    totalAchievements: 12,
    unlockedCount: 0,
    claimableCount: 0
  });

  // Real backend AI Coach smart recommendation state
  const [topRecommendation, setTopRecommendation] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      setLoadingGoals(false);
      setLoadingQuests(false);
      return;
    }
    setLoadingGoals(true);
    setLoadingQuests(true);
    setGoalsError('');
    setQuestsError('');

    try {
      const [goalsRes, questsRes, challengeRes, myRankRes, statsRes, friendsRes, requestsRes, analyticsRes, notifCountRes, latestNotifRes, achStatsRes, recsRes] =
        await Promise.all([
          getGoals(token).catch((err) => ({ success: false, message: err.message })),
          getQuests(token).catch((err) => ({ success: false, message: err.message })),
          getTodayChallenge(token).catch((err) => ({ success: false, message: err.message })),
          getMyLeaderboardRank(token).catch(() => null),
          getLeaderboardStats(token).catch(() => null),
          getFriends(token).catch(() => null),
          getFriendRequests(token).catch(() => null),
          getAnalyticsOverview(token).catch(() => null),
          getUnreadNotificationsCount(token).catch(() => null),
          getNotifications(token, { limit: 1 }).catch(() => null),
          getAchievementProgress(token).catch(() => null),
          getAiRecommendations(token).catch(() => null)
        ]);

      if (goalsRes && goalsRes.success) {
        setGoals(goalsRes.goals || []);
      } else {
        setGoalsError('Unable to load goals. Please start the backend.');
      }

      if (questsRes && questsRes.success) {
        setQuests(questsRes.quests || []);
      } else {
        setQuestsError('Unable to load quests. Please start the backend.');
      }

      if (challengeRes && challengeRes.success && challengeRes.data) {
        setTodayChallenge(challengeRes.data);
      }

      if (myRankRes && myRankRes.success && myRankRes.data) {
        setLeaderboardInfo(prev => ({
          ...prev,
          userRank: myRankRes.data.rank,
          totalUsers: myRankRes.data.totalUsers || prev.totalUsers
        }));
      }

      if (statsRes && statsRes.success && statsRes.data) {
        setLeaderboardInfo(prev => ({
          ...prev,
          topUser: statsRes.data.topUser,
          totalUsers: statsRes.data.totalUsers || prev.totalUsers
        }));
      }

      if (friendsRes && friendsRes.success) {
        setFriendsSummary(prev => ({
          ...prev,
          count: friendsRes.count || friendsRes.data?.length || 0
        }));
      }

      if (requestsRes && requestsRes.success && requestsRes.data) {
        setFriendsSummary(prev => ({
          ...prev,
          pendingRequests: requestsRes.data.incoming?.length || 0
        }));
      }

      if (analyticsRes && analyticsRes.success && analyticsRes.data) {
        setAnalyticsOverview(analyticsRes.data);
      }

      if (notifCountRes && notifCountRes.success && typeof notifCountRes.count === 'number') {
        setUnreadNotifs(notifCountRes.count);
      }

      if (latestNotifRes && latestNotifRes.success && latestNotifRes.data && latestNotifRes.data.length > 0) {
        setLatestNotif(latestNotifRes.data[0]);
      }

      if (achStatsRes && achStatsRes.success && achStatsRes.data) {
        setAchievementStats(achStatsRes.data);
      }

      if (recsRes && recsRes.success && Array.isArray(recsRes.data) && recsRes.data.length > 0) {
        setTopRecommendation(recsRes.data[0]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err.message);
      setGoalsError('Unable to load goals. Please start the backend.');
      setQuestsError('Unable to load quests. Please start the backend.');
    } finally {
      setLoadingGoals(false);
      setLoadingQuests(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleToggleQuest = async (questId) => {
    const targetQuest = quests.find(q => (q._id === questId || q.id === questId));
    if (!targetQuest) return;

    if (targetQuest.status === 'completed' || targetQuest.completed) {
      setDemoNotice(`🛡️ Quest “${targetQuest.title}” is already completed.`);
      return;
    }

    try {
      const res = await completeQuest(questId, token);
      if (res && res.success) {
        setQuests(prev =>
          prev.map(q => ((q._id === questId || q.id === questId) ? res.quest : q))
        );
        if (res.user && updateUser) {
          updateUser(res.user);
        }
        setBossHp(hp => Math.max(10, hp - 15));
        setDemoNotice(`⚔️ Quest completed! Struck boss for damage and earned +${res.quest.xpReward} XP!`);
      } else {
        setDemoNotice(res?.message || 'Failed to complete quest.');
      }
    } catch (err) {
      setDemoNotice(err.message || 'Failed to complete quest.');
    }
  };

  const handleActionClick = (actionName) => {
    setDemoNotice(`${actionName} triggered. (Backend routes will connect in Step 2).`);
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 font-sans pb-16">
      
      {/* 1. DASHBOARD COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Greeting */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl text-red-600 font-serif leading-none">†</span>
              <span className="font-rpg text-xl font-bold tracking-wider text-red-600 group-hover:text-red-500 transition-colors">
                LifeForge
              </span>
            </Link>

            <div className="hidden sm:block h-6 w-px bg-slate-800" />

            <div>
              <h1 className="text-sm sm:text-base font-bold font-rpg text-white tracking-wide flex items-center gap-2">
                <span>WELCOME BACK, {user?.name ? user.name.toUpperCase() : 'ANKUR'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Your next victory starts with today’s quest.
              </p>
            </div>
          </div>

          {/* Header Controls: Notification, Profile, Logout */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell Link */}
            <Link
              to="/notifications"
              aria-label="View notifications"
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </Link>

            {/* Profile Avatar Link */}
            <Link
              to="/character"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 transition-colors group"
              title="View Character Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-bold text-xs font-rpg text-black group-hover:scale-105 transition-transform">
                {user?.avatar || user?.name?.slice(0, 1).toUpperCase() || 'A'}
              </div>
              <span className="text-xs font-mono text-slate-300 group-hover:text-amber-300 hidden md:block transition-colors">
                {user?.name || 'Ankur'} (Lv.{user?.level || 8})
              </span>
            </Link>

            {/* Quest Board Nav Link */}
            <Link
              to="/quests"
              className="px-3 py-1.5 rounded-xl border border-slate-800 hover:border-amber-500/40 bg-slate-900/80 hover:bg-[#141824] text-xs font-mono text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Quests</span>
            </Link>

            {/* Analytics Nav Link */}
            <Link
              to="/analytics"
              className="px-3 py-1.5 rounded-xl border border-slate-800 hover:border-amber-500/40 bg-slate-900/80 hover:bg-[#141824] text-xs font-mono text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <span>📊</span>
              <span className="hidden sm:inline">Analytics</span>
            </Link>

            {/* Friends & Party Nav Link */}
            <Link
              to="/friends"
              className="px-3 py-1.5 rounded-xl border border-slate-800 hover:border-purple-500/40 bg-slate-900/80 hover:bg-[#141824] text-xs font-mono text-slate-300 hover:text-purple-300 transition-colors flex items-center gap-1.5 relative"
            >
              <span>👥</span>
              <span className="hidden sm:inline">Friends</span>
              {friendsSummary.pendingRequests > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-extrabold text-[9px] animate-pulse">
                  {friendsSummary.pendingRequests}
                </span>
              )}
            </Link>

            {/* Leaderboard Nav Link */}
            <Link
              to="/leaderboard"
              className="px-3 py-1.5 rounded-xl border border-slate-800 hover:border-purple-500/40 bg-slate-900/80 hover:bg-[#141824] text-xs font-mono text-slate-300 hover:text-purple-300 transition-colors flex items-center gap-1.5"
            >
              <span>👑</span>
              <span className="hidden sm:inline">Leaderboard</span>
            </Link>

            {/* Achievements / Feats Link */}
            <Link
              to="/achievements"
              className="px-3 py-1.5 rounded-xl border border-amber-500/40 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/40 text-xs font-mono text-amber-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>🏆</span>
              <span className="hidden sm:inline">Feats</span>
            </Link>

            {/* Admin Command Link (Admin only) */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1"
                title="Admin Dashboard"
              >
                <span>⚡</span>
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}

            {/* Help / FAQ Link */}
            <Link
              to="/help"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-400 hover:text-white transition-colors"
              title="Help & FAQ"
              aria-label="Help & FAQ"
            >
              <span className="text-xs">❓</span>
            </Link>

            {/* Notifications Link with Live Badge */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-slate-400 hover:text-white transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <span className="text-xs">🔔</span>
              {unreadNotifs > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 min-w-[16px] h-[16px] rounded-full bg-red-600 border border-red-400 text-white font-mono font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadNotifs > 99 ? '99+' : unreadNotifs}
                </span>
              )}
            </Link>

            {/* Settings Link */}
            <Link
              to="/settings"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Settings"
              aria-label="Settings"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            {/* Connected Logout Button */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-800 hover:border-red-900 bg-black/40 hover:bg-red-950/30 text-xs font-mono text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Local Demo State Banner */}
        <div className="mb-6 p-3 rounded-xl bg-[#0E111A] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Mode: <strong>Local Demo UI State</strong> • Data interactions preview only</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
            >
              {showEmptyState ? 'Show Active Campaign' : 'Preview Empty State'}
            </button>
          </div>
        </div>

        {/* Temporary Notice Feedback */}
        {demoNotice && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between animate-in fade-in duration-200">
            <span>{demoNotice}</span>
            <button onClick={() => setDemoNotice('')} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Latest Unread Realm Dispatch Banner */}
        {latestNotif && !latestNotif.isRead && (
          <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#13101E] to-[#0E111A] border border-purple-500/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-in fade-in">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-xl shrink-0">
                {latestNotif.type === 'quest' ? '⚔️' : latestNotif.type === 'goal' ? '🎯' : latestNotif.type === 'challenge' ? '⚡' : latestNotif.type === 'boss' ? '🐉' : latestNotif.type === 'friend' ? '👥' : '📢'}
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-white block font-rpg truncate">
                  Latest Dispatch: {latestNotif.title}
                </span>
                <span className="text-slate-400 block line-clamp-1 text-[11px] mt-0.5">
                  {latestNotif.message}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/notifications"
                className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-semibold font-mono transition-colors flex items-center gap-1.5"
              >
                <span>View Dispatches</span>
                {unreadNotifs > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-bold">
                    {unreadNotifs} New
                  </span>
                )}
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* AI Life Coach Smart Recommendation Banner */}
        {topRecommendation && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-[#120F1D] to-[#0A0D15] border border-purple-500/50 flex flex-wrap items-center justify-between gap-4 shadow-xl animate-in fade-in">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-xl shrink-0 shadow-glow-gold/10">
                🔮
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full font-bold uppercase bg-purple-950 text-purple-300 border border-purple-500/40">
                    Oracle Directive
                  </span>
                  <h4 className="font-bold text-white font-rpg text-sm truncate">
                    {topRecommendation.title}
                  </h4>
                </div>
                <p className="text-slate-300 text-xs font-mono mt-0.5 line-clamp-2">
                  {topRecommendation.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to={topRecommendation.actionRoute || '/ai-coach'}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs shadow-glow-gold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{topRecommendation.actionLabel || 'Execute Action'}</span>
                <span>→</span>
              </Link>
              <Link
                to="/ai-coach"
                className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-mono transition-colors flex items-center gap-1"
                title="Consult AI Life Coach"
              >
                <span>Ask Coach 🧙‍♂️</span>
              </Link>
            </div>
          </div>
        )}

        {/* 5. QUICK STATS ROW */}
        {(() => {
          const completedQuestsCount = quests.filter(q => q.status === 'completed' || q.completed).length;
          const questClearanceRate = quests.length > 0
            ? Math.round((completedQuestsCount / quests.length) * 100)
            : (analyticsOverview?.quests?.completionPercentage || 0);

          const completedGoalsCount = goals.filter(g => g.status === 'completed').length;
          const goalClearanceRate = goals.length > 0
            ? Math.round((completedGoalsCount / goals.length) * 100)
            : (analyticsOverview?.goals?.completionPercentage || 0);

          const userLvl = user?.level || analyticsOverview?.xp?.level || 1;
          const userXp = user?.xp || analyticsOverview?.xp?.totalXp || 0;
          const currentLevelBaseXp = (userLvl - 1) * 500;
          const xpIntoLevel = Math.max(0, userXp - currentLevelBaseXp);
          const xpProgressPercent = Math.min(100, Math.round((xpIntoLevel / 500) * 100));

          const userStreak = user?.streak || analyticsOverview?.streak?.currentStreak || 0;
          const userLongestStreak = user?.longestStreak || analyticsOverview?.streak?.longestStreak || userStreak;

          return (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  label="Current Streak"
                  value={`${userStreak} Days`}
                  subtitle={`Longest Streak: ${userLongestStreak} Days`}
                  accent="red"
                  icon={<span className="text-xl">🔥</span>}
                />
                <StatCard
                  label="Quests Clearance"
                  value={`${completedQuestsCount} / ${quests.length}`}
                  subtitle={`${questClearanceRate}% completion rate`}
                  accent="purple"
                  icon={<span className="text-xl">⚔️</span>}
                />
                <StatCard
                  label="Level Progression"
                  value={`Level ${userLvl}`}
                  subtitle={`${xpProgressPercent}% to Lv.${userLvl + 1} (${xpIntoLevel}/500 XP)`}
                  accent="amber"
                  icon={<span className="text-xl">⚡</span>}
                />
                <StatCard
                  label="Campaigns Conquered"
                  value={`${completedGoalsCount} / ${goals.length}`}
                  subtitle={`${goalClearanceRate}% goals completed`}
                  accent="emerald"
                  icon={<span className="text-xl">🏆</span>}
                />
              </div>

              {/* 8. QUICK ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link
                  to="/create-goal"
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/40 flex items-center gap-2 cursor-pointer"
                >
                  <span>+ Create New Goal</span>
                </Link>

                <Link
                  to="/quests"
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-[#0E111A] border border-slate-700 hover:border-amber-500/50 hover:bg-[#141824] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>📋 Quest Board</span>
                </Link>

                <Link
                  to="/bosses"
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-[#0E111A] border border-slate-700 hover:border-red-500/50 hover:bg-[#141824] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>🐉 Boss Collection</span>
                </Link>

                <Link
                  to="/analytics"
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-amber-300 bg-amber-950/20 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>📈 Progress Analytics</span>
                </Link>

                <Link
                  to="/notifications"
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-purple-300 bg-purple-950/20 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-950/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>🔔 Notifications</span>
                  {unreadNotifs > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                      {unreadNotifs}
                    </span>
                  )}
                </Link>

                <Link
                  to="/ai-coach"
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-purple-200 bg-gradient-to-r from-purple-950/50 to-amber-950/30 border border-purple-500/50 hover:border-purple-400 transition-all flex items-center gap-2 cursor-pointer shadow-glow-gold/10"
                >
                  <span>🔮 AI Life Coach</span>
                </Link>
              </div>
            </>
          );
        })()}

        {/* 9. EMPTY STATE (When user has no active goal) */}
        {showEmptyState ? (
          <div className="bg-[#0E111A] border border-slate-800 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden mb-12">
            <div className="w-16 h-16 rounded-2xl bg-red-950/50 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-3xl shadow-glow-crimson">
              🐉
            </div>
            <h2 className="text-2xl font-bold font-rpg text-white mb-2">
              Your next boss is waiting.
            </h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              You currently have no active campaign. Pick an ambition, decompose it into daily quests, and awaken your next nemesis boss.
            </p>
            <Link
              to="/create-goal"
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/50 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Create Your First Goal</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          /* MAIN 2-COLUMN COMMAND CENTER GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ================= LEFT COLUMN: BOSS & QUESTS (7 COLS) ================= */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* 3. ACTIVE GOAL BOSS CARD */}
              <BossCard
                bossName="THE PROCRASTINATION KING"
                goalTitle={goals[0]?.title || "Build My First Full-Stack Project"}
                hpPercentage={goals[0] ? Math.max(10, 100 - (goals[0].progress || 0)) : bossHp}
                daysRemaining={18}
                completedMilestones={goals[0] ? (goals[0].milestones?.filter(m => m.completed).length || 0) : 4}
                totalMilestones={goals[0] ? (goals[0].milestones?.length || 4) : 10}
                onViewBattle={() => navigate('/boss-battle')}
              />

              {/* 3.5 REAL BACKEND GOALS SECTION */}
              <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 sm:p-7 shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div>
                    <h3 className="text-base font-bold font-rpg text-white flex items-center gap-2">
                      <span>YOUR ACTIVE GOALS</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30">
                        {goals.length} {goals.length === 1 ? 'Campaign' : 'Campaigns'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Real-life ambitions transformed into conquerable boss battles
                    </p>
                  </div>

                  <Link
                    to="/create-goal"
                    className="text-xs font-mono text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>+ Forge Goal</span>
                  </Link>
                </div>

                {/* Backend Offline / Error Banner */}
                {goalsError && (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-center justify-between gap-3 mb-4 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <span>{goalsError}</span>
                    </div>
                    <button
                      onClick={fetchGoals}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Loading State */}
                {loadingGoals ? (
                  <div className="py-8 text-center text-xs font-mono text-slate-400 space-y-3">
                    <div className="w-8 h-8 mx-auto border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    <p>Synchronizing active goals from LifeForge database...</p>
                  </div>
                ) : goals.length === 0 ? (
                  /* Empty State */
                  <div className="py-8 px-4 text-center rounded-xl bg-[#141824]/60 border border-dashed border-slate-800">
                    <div className="text-3xl mb-2">🎯</div>
                    <h4 className="text-sm font-bold font-rpg text-white mb-1">
                      No goals created yet. Forge your first goal!
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mb-4 max-w-sm mx-auto">
                      Transform your real-life aspirations into RPG boss battles and earn XP.
                    </p>
                    <Link
                      to="/create-goal"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:brightness-110 shadow-glow-crimson transition-all cursor-pointer"
                    >
                      <span>+ Forge Your First Goal</span>
                      <span>→</span>
                    </Link>
                  </div>
                ) : (
                  /* Real Goals List */
                  <div className="space-y-3.5">
                    {goals.map((g) => (
                      <div
                        key={g._id}
                        className="p-4 rounded-xl bg-[#141824] border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              {g.category || 'General'}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              g.difficulty === 'Easy' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' :
                              g.difficulty === 'Hard' || g.difficulty === 'Epic' || g.difficulty === 'Legendary' ? 'bg-red-950/40 text-red-400 border-red-500/30' :
                              'bg-amber-950/40 text-amber-400 border-amber-500/30'
                            }`}>
                              {g.difficulty || 'Medium'}
                            </span>
                            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                              g.status === 'completed' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' :
                              g.status === 'paused' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                              'bg-blue-950/40 text-blue-400 border border-blue-500/30'
                            }`}>
                              {g.status || 'active'}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold font-rpg text-white group-hover:text-amber-300 transition-colors truncate">
                            {g.title}
                          </h4>

                          {g.description && (
                            <p className="text-xs text-slate-400 line-clamp-1 font-mono">
                              {g.description}
                            </p>
                          )}

                          {/* Progress Bar & Percentage */}
                          <div className="pt-1.5 max-w-md">
                            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                              <span className="text-slate-400">Campaign Progress</span>
                              <span className="text-amber-400 font-bold">{g.progress || 0}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(0, g.progress || 0))}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* View Details Action */}
                        <div className="shrink-0 flex items-center gap-2">
                          <Link
                            to={`/goal/${g._id}`}
                            className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>View Details</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. TODAY'S QUESTS SECTION */}
              <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 sm:p-7 shadow-xl">
                
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base font-bold font-rpg text-white flex items-center gap-2">
                      <span>TODAY’S QUESTS</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/30">
                        {quests.filter(q => q.status === 'completed' || q.completed).length} / {quests.length} Completed
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Check a quest to strike damage on the active boss
                    </p>
                  </div>

                  <Link
                    to="/quests"
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Manage All Quests</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Quests Error Banner */}
                {questsError && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-center justify-between gap-3 mb-3">
                    <span>⚠️ {questsError}</span>
                    <button
                      onClick={fetchDashboardData}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Quest cards stack / Loading / Empty state */}
                {loadingQuests ? (
                  <div className="py-8 text-center text-xs font-mono text-slate-400 space-y-2">
                    <div className="w-6 h-6 mx-auto border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p>Loading active quests...</p>
                  </div>
                ) : quests.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#141824]/60 border border-dashed border-slate-800 text-center my-2">
                    <span className="text-2xl mb-1 block">📜</span>
                    <h4 className="text-xs font-bold font-rpg text-white mb-0.5">No quests found</h4>
                    <p className="text-[11px] text-slate-400 font-mono mb-3">Visit the Quest Board to accept or forge new quests.</p>
                    <Link
                      to="/quests"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 border border-red-500/40 text-white text-xs font-mono font-semibold transition-colors"
                    >
                      <span>+ Go to Quest Board</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quests.slice(0, 5).map(quest => (
                      <QuestCard
                        key={quest._id || quest.id}
                        quest={quest}
                        onToggle={handleToggleQuest}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Daily Habit Multiplier: <strong>1.5x Damage Active</strong></span>
                  <span className="text-red-400 font-bold">Resets at midnight</span>
                </div>

                {/* Daily Challenge Banner */}
                <Link
                  to="/daily-challenge"
                  className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#13101E] to-purple-950/40 border border-amber-500/40 hover:border-amber-400 text-xs font-mono flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">⚡</span>
                    <div>
                      <span className="font-bold font-rpg text-white group-hover:text-amber-300 transition-colors">
                        Daily Challenge: {todayChallenge?.title || 'Build Your Daily Momentum'}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {todayChallenge?.status === 'completed'
                          ? `✓ Completed today • +${todayChallenge?.xpReward || 50} XP Claimed`
                          : `${todayChallenge?.difficulty || 'Medium'} Difficulty • +${todayChallenge?.xpReward || 50} XP Bounty`}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg border font-bold shrink-0 text-xs ${
                    todayChallenge?.status === 'completed'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {todayChallenge?.status === 'completed' ? 'Completed ✓' : 'View Challenge →'}
                  </span>
                </Link>

              </div>

            </div>

            {/* ================= RIGHT COLUMN: PLAYER STATS, SKILLS & ACTIVITY (5 COLS) ================= */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* 2. PLAYER OVERVIEW CARD */}
              <PlayerOverview
                playerName={user?.name || 'Ankur'}
                level={user?.level || 1}
                currentXp={user?.xp || playerXp}
                maxXp={1000}
                rank="RISING BUILDER"
                stats={{ discipline: 72, focus: 64, consistency: 58 }}
              />

              {/* 2.4 HALL OF FEATS / ACHIEVEMENTS SUMMARY WIDGET */}
              <div className="bg-[#0E111A] border border-[#1E2538] hover:border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <h3 className="text-base font-bold font-rpg text-white">
                      HALL OF FEATS
                    </h3>
                  </div>
                  <Link
                    to="/achievements"
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View All</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#080A12] border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Unlocked Trophies
                    </span>
                    <span className="text-lg font-bold font-rpg text-emerald-400 mt-1 block">
                      {achievementStats.unlockedCount} / {achievementStats.totalAchievements || 12}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl bg-[#080A12] border ${achievementStats.claimableCount > 0 ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'}`}>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Claimable XP
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-lg font-bold font-rpg ${achievementStats.claimableCount > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                        {achievementStats.claimableCount}
                      </span>
                      {achievementStats.claimableCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold animate-pulse">
                          Claim!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  to="/achievements"
                  className="w-full py-2 px-3 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/30 hover:border-amber-500/60 text-xs font-mono text-amber-300 hover:text-white transition-all flex items-center justify-between text-center group cursor-pointer"
                >
                  <span>Conquer Objectives & Claim XP</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              {/* 2.5 LEADERBOARD STANDINGS PREVIEW WIDGET */}
              <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-lg">🏆</span>
                    <h3 className="text-base font-bold font-rpg text-white">
                      REALM STANDINGS
                    </h3>
                  </div>
                  <Link
                    to="/leaderboard"
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Leaderboard</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  {/* Current User Standing */}
                  <div className="p-3 rounded-xl bg-[#080A12] border border-purple-500/30">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Your Standing
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-lg font-bold font-rpg text-purple-300">
                        #{leaderboardInfo.userRank || 1}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        of {leaderboardInfo.totalUsers || 1} hunters
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400 mt-0.5 block font-bold">
                      ⚡ {user?.xp || 0} Total XP
                    </span>
                  </div>

                  {/* Top Realm Hunter */}
                  <div className="p-3 rounded-xl bg-[#080A12] border border-amber-500/30">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                      <span>👑 #1 Champion</span>
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 truncate">
                      <span className="text-sm font-bold font-rpg text-amber-300 truncate">
                        {leaderboardInfo.topUser?.name || user?.name || 'Apex Hunter'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Lv.{leaderboardInfo.topUser?.level || user?.level || 1} • ⚡ {(leaderboardInfo.topUser?.xp || user?.xp || 0).toLocaleString()} XP
                    </span>
                  </div>
                </div>

                <Link
                  to="/leaderboard"
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#13101E] to-purple-950/40 border border-amber-500/30 hover:border-amber-500/60 text-xs font-mono text-amber-300 hover:text-white transition-all flex items-center justify-between text-center group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>View Hall of Glory Rankings</span>
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              {/* 2.6 ALLIES & SOCIAL REALM WIDGET */}
              <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <h3 className="text-base font-bold font-rpg text-white">
                      ALLIES & SOCIAL REALM
                    </h3>
                  </div>
                  <Link
                    to="/friends"
                    className="text-xs font-mono text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Friends Page</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#080A12] border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Total Friends
                    </span>
                    <span className="text-lg font-bold font-rpg text-white mt-1 block">
                      {friendsSummary.count} {friendsSummary.count === 1 ? 'Ally' : 'Allies'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl bg-[#080A12] border ${friendsSummary.pendingRequests > 0 ? 'border-amber-500/40' : 'border-slate-800'}`}>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Pending Invocations
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-lg font-bold font-rpg ${friendsSummary.pendingRequests > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {friendsSummary.pendingRequests}
                      </span>
                      {friendsSummary.pendingRequests > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold animate-pulse">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  to="/friends"
                  className="w-full py-2 px-3 rounded-xl bg-purple-950/30 hover:bg-purple-950/50 border border-purple-500/30 hover:border-purple-500/60 text-xs font-mono text-purple-300 hover:text-white transition-all flex items-center justify-between text-center group cursor-pointer"
                >
                  <span>Find Hunters & Manage Friends</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              {/* 2.7 PROGRESS ANALYTICS PREVIEW WIDGET */}
              <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📈</span>
                    <h3 className="text-base font-bold font-rpg text-white">
                      PROGRESS ANALYTICS
                    </h3>
                  </div>
                  <Link
                    to="/analytics"
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Full Analytics</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  {/* Quest Completion Rate */}
                  <div className="p-3 rounded-xl bg-[#080A12] border border-emerald-500/30">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Quest Clearance
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-bold font-rpg text-emerald-400">
                        {quests.length > 0 ? Math.round((quests.filter(q => q.status === 'completed' || q.completed).length / quests.length) * 100) : 0}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({quests.filter(q => q.status === 'completed' || q.completed).length}/{quests.length})
                      </span>
                    </div>
                  </div>

                  {/* Goal Completion Rate */}
                  <div className="p-3 rounded-xl bg-[#080A12] border border-amber-500/30">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Goal Clearance
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-bold font-rpg text-amber-300">
                        {goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({goals.filter(g => g.status === 'completed').length}/{goals.length})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Level XP Progress Bar */}
                {(() => {
                  const userLvl = user?.level || 1;
                  const userXp = user?.xp || 0;
                  const currentLevelBaseXp = (userLvl - 1) * 500;
                  const xpIntoLevel = Math.max(0, userXp - currentLevelBaseXp);
                  const xpPct = Math.min(100, Math.round((xpIntoLevel / 500) * 100));

                  return (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Level {userLvl} Progression</span>
                        <span className="text-amber-400 font-bold">{xpIntoLevel} / 500 XP ({xpPct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          style={{ width: `${xpPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

                <Link
                  to="/analytics"
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-950/30 via-[#13101E] to-amber-950/30 border border-amber-500/30 hover:border-amber-500/60 text-xs font-mono text-amber-300 hover:text-white transition-all flex items-center justify-between text-center group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span>📊</span>
                    <span>View 7-Day XP & Habit Rhythm</span>
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              {/* 6. SKILL PROGRESSION CARD */}
              <SkillProgress
                onViewCharacter={() => navigate('/character')}
              />

              {/* 7. RECENT ACTIVITY LIST */}
              <ActivityList />

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
