import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AnalyticsSummaryCards from '../components/analytics/AnalyticsSummaryCards';
import XpBarChart from '../components/analytics/XpBarChart';
import QuestCompletionSection from '../components/analytics/QuestCompletionSection';
import GoalAnalyticsSection from '../components/analytics/GoalAnalyticsSection';
import BossDamageSection from '../components/analytics/BossDamageSection';
import WeeklyPerformance from '../components/analytics/WeeklyPerformance';
import AchievementInsight from '../components/analytics/AchievementInsight';
import {
  getAnalyticsOverview,
  getQuestAnalytics,
  getGoalAnalytics,
  getXpAnalytics,
  getStreakAnalytics
} from '../services/api';

export default function AnalyticsPage() {
  const { user, token } = useAuth();
  const [activeFilter, setActiveFilter] = useState('This Week');
  const filters = ['This Week', 'This Month', 'All Time'];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Analytics states
  const [overview, setOverview] = useState(null);
  const [questStats, setQuestStats] = useState(null);
  const [goalStats, setGoalStats] = useState(null);
  const [xpStats, setXpStats] = useState(null);
  const [streakStats, setStreakStats] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [overviewRes, questRes, goalRes, xpRes, streakRes] = await Promise.all([
        getAnalyticsOverview(token).catch((err) => ({ success: false, message: err.message })),
        getQuestAnalytics(token).catch((err) => ({ success: false, message: err.message })),
        getGoalAnalytics(token).catch((err) => ({ success: false, message: err.message })),
        getXpAnalytics(token).catch((err) => ({ success: false, message: err.message })),
        getStreakAnalytics(token).catch((err) => ({ success: false, message: err.message }))
      ]);

      if (overviewRes && overviewRes.success) {
        setOverview(overviewRes.data);
      } else {
        setError(overviewRes?.message || 'Unable to connect to LifeForge Analytics service.');
      }

      if (questRes && questRes.success) {
        setQuestStats(questRes.data);
      }
      if (goalRes && goalRes.success) {
        setGoalStats(goalRes.data);
      }
      if (xpRes && xpRes.success) {
        setXpStats(xpRes.data);
      }
      if (streakRes && streakRes.success) {
        setStreakStats(streakRes.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('An unexpected error occurred while loading analytics data.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Derived filter calculations
  const totalXp =
    activeFilter === 'This Week'
      ? xpStats?.xpEarnedLast7Days || 0
      : activeFilter === 'This Month'
      ? xpStats?.xpEarnedLast30Days || 0
      : overview?.xp?.totalXp || user?.xp || 0;

  const questsCompleted =
    activeFilter === 'This Week'
      ? questStats?.completedLast7Days || 0
      : activeFilter === 'This Month'
      ? questStats?.completedLast30Days || 0
      : overview?.quests?.completed || 0;

  const totalQuests = overview?.quests?.total || 0;
  const questCompletionRate = overview?.quests?.completionPercentage || 0;

  const currentStreak = overview?.streak?.currentStreak ?? user?.streak ?? 0;
  const longestStreak = overview?.streak?.longestStreak ?? user?.longestStreak ?? currentStreak;
  const bossesDefeated = overview?.bosses?.defeated || 0;
  const activeBosses = overview?.bosses?.activeBosses || 0;
  const challengesCompleted = overview?.dailyChallenges?.completed || 0;

  const isBrandNewHunter =
    !loading &&
    !error &&
    overview?.goals?.total === 0 &&
    overview?.quests?.total === 0 &&
    (overview?.xp?.totalXp || 0) === 0;

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-amber-500/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-4">
          <Link to="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-amber-400 font-medium">Progress Analytics</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                📈
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                  Progress Analytics
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 font-mono mt-0.5">
                  Real calculated growth metrics, habit rhythm, and conquer efficiency.
                </p>
              </div>
            </div>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 self-start md:self-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Error / Offline Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <span className="font-bold text-red-200 block">Analytics Sync Notice:</span>
                <span>{error}</span>
              </div>
            </div>
            <button
              onClick={fetchAnalytics}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs transition-colors cursor-pointer shrink-0"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 mx-auto border-3 border-amber-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Summoning Realm Battle Records & Growth Analytics...
            </p>
          </div>
        ) : (
          <>
            {/* Empty State Banner for New Hunters */}
            {isBrandNewHunter && (
              <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/20 via-purple-950/20 to-black/40 border border-amber-500/30 text-center space-y-3">
                <div className="text-3xl">⚔️</div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                  Your Journey Awaits, Hunter!
                </h3>
                <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-lg mx-auto">
                  You have not created any goals or quests yet. Forge your first goal and complete quests to populate your analytics timeline.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/create-goal"
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-neutral-950 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 shadow-md transition-all"
                  >
                    + Forge First Goal
                  </Link>
                  <Link
                    to="/quests"
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    View Quests
                  </Link>
                </div>
              </div>
            )}

            {/* 1. Summary Cards */}
            <div className="mb-8">
              <AnalyticsSummaryCards
                totalXp={totalXp}
                level={overview?.xp?.level || user?.level || 1}
                nextLevelXp={overview?.xp?.nextLevelXp || 500}
                questsCompleted={questsCompleted}
                totalQuests={totalQuests}
                questCompletionRate={questCompletionRate}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                bossesDefeated={bossesDefeated}
                activeBosses={activeBosses}
                challengesCompleted={challengesCompleted}
              />
            </div>

            {/* 2. XP Progression Bar Chart & Quest Clearance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <XpBarChart
                  activeFilter={activeFilter}
                  dailyXp={xpStats?.dailyXp7Days || []}
                  xpEarnedLast7Days={xpStats?.xpEarnedLast7Days || 0}
                  xpEarnedLast30Days={xpStats?.xpEarnedLast30Days || 0}
                  peakXp={xpStats?.peakXp || 0}
                  totalXp={overview?.xp?.totalXp || 0}
                />
              </div>
              <div className="lg:col-span-1">
                <QuestCompletionSection
                  completed={overview?.quests?.completed || 0}
                  pending={overview?.quests?.pending || 0}
                  total={overview?.quests?.total || 0}
                  rate={overview?.quests?.completionPercentage || 0}
                  difficultyBreakdown={questStats?.difficultyBreakdown}
                />
              </div>
            </div>

            {/* 3. Goal Analytics & Boss Battle Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <GoalAnalyticsSection
                totalGoals={overview?.goals?.total || 0}
                activeGoals={overview?.goals?.active || 0}
                completedGoals={overview?.goals?.completed || 0}
                pausedGoals={goalStats?.pausedGoals || 0}
                completionPercentage={overview?.goals?.completionPercentage || 0}
                categories={goalStats?.categories || []}
                recentGoals={goalStats?.recentGoals || []}
              />

              <BossDamageSection
                bossesDefeated={bossesDefeated}
                activeBosses={activeBosses}
                totalGoals={overview?.goals?.total || 0}
                activeBossName={goalStats?.recentGoals?.[0]?.title || 'The Procrastination Demon'}
                bossProgress={goalStats?.recentGoals?.[0]?.progress || 0}
              />
            </div>

            {/* 4. Weekly Rhythm & Habit Consistency */}
            <div className="mb-8">
              <WeeklyPerformance
                dailyActivity={questStats?.dailyCompletion7Days || []}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                consistencyScore={streakStats?.challengeClearanceRate}
              />
            </div>

            {/* 5. Achievement Insight Banner */}
            <div className="mb-4">
              <AchievementInsight />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
