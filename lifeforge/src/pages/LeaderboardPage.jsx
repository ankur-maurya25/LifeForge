import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard, getLeaderboardStats } from '../services/api';
import CurrentUserCard from '../components/leaderboard/CurrentUserCard';
import WeeklyChallengeCard from '../components/leaderboard/WeeklyChallengeCard';
import LeaderboardFilters from '../components/leaderboard/LeaderboardFilters';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import TopThreePodium from '../components/leaderboard/TopThreePodium';

export default function LeaderboardPage() {
  const { user, token } = useAuth();

  const [category, setCategory] = useState('xp');
  const [users, setUsers] = useState([]);
  const [currentUserStanding, setCurrentUserStanding] = useState(null);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Fetch real leaderboard data from backend
  const fetchLeaderboardData = useCallback(async (isRefresh = false) => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const [leaderboardRes, statsRes] = await Promise.all([
        getLeaderboard({ type: category, limit: 20, page: 1 }, token).catch((err) => ({
          success: false,
          message: err.message
        })),
        getLeaderboardStats(token).catch(() => null)
      ]);

      if (leaderboardRes && leaderboardRes.success) {
        setUsers(leaderboardRes.data || []);
        if (leaderboardRes.currentUser) {
          setCurrentUserStanding(leaderboardRes.currentUser);
        } else if (user) {
          setCurrentUserStanding({
            rank: (leaderboardRes.data?.length || 0) + 1,
            _id: user.id || user._id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            level: user.level || 1,
            xp: user.xp || 0,
            completedQuests: 0,
            streak: user.streak || 0,
            longestStreak: user.longestStreak || 0
          });
        }
      } else {
        setError(leaderboardRes?.message || 'Database connection error. Unable to load rankings.');
      }

      if (statsRes && statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Unable to reach LifeForge API server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, category, user]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  const handleRefresh = () => {
    fetchLeaderboardData(true);
  };

  const categoryLabels = {
    xp: 'Overall XP Bounty',
    level: 'Hunter Level & Mastery',
    quests: 'Completed Tactical Quests',
    streak: 'Consecutive Discipline Streak'
  };

  const topThree = users.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 font-sans pb-24">
      
      {/* 1. TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl text-red-600 font-serif leading-none">†</span>
              <span className="font-rpg text-xl font-bold tracking-wider text-red-600 group-hover:text-red-500 transition-colors">
                LifeForge
              </span>
            </Link>

            <div className="hidden sm:block h-6 w-px bg-slate-800" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">🏆</span>
                <h1 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide">
                  LEADERBOARD & HALL OF GLORY
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40">
                  Competitive Season 1
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Compete with hunters across the realm. Stay consistent. Level up.
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Dashboard</span>
            </Link>

            <Link
              to="/quests"
              className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-amber-300 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <span>📋</span>
              <span>Quest Board</span>
            </Link>

            <Link
              to="/daily-challenge"
              className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-amber-300 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>Daily Challenge</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Status & Overview Banner */}
        <div className="p-3.5 rounded-2xl bg-[#0E111A] border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-slate-300">
              Active Ranking: <strong>{categoryLabels[category]}</strong> • Tie-breaker: <strong>Level & Completed Quests</strong>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-2">
            <span>🛡️ Total Hunters: {stats?.totalUsers || users.length || 0}</span>
            <span>•</span>
            <span className="text-amber-400">⚡ Top: {stats?.topUser?.name || users[0]?.name || 'Champion'}</span>
          </div>
        </div>

        {/* 1. TOP 3 PODIUM (Gold, Silver, Bronze) */}
        {!loading && topThree.length > 0 && (
          <TopThreePodium
            topUsers={topThree}
            category={category}
            currentUserId={user?.id || user?._id}
          />
        )}

        {/* 2. CURRENT USER HIGHLIGHT CARD */}
        {currentUserStanding && (
          <CurrentUserCard
            user={currentUserStanding}
            category={category}
          />
        )}

        {/* 3. WEEKLY CHALLENGE BANNER */}
        <WeeklyChallengeCard />

        {/* 4. FILTER CONTROLS & REFRESH */}
        <LeaderboardFilters
          category={category}
          onCategoryChange={setCategory}
          onRefresh={handleRefresh}
          loading={refreshing}
        />

        {/* 5. LEADERBOARD TABLE */}
        <LeaderboardTable
          users={users}
          currentUserId={user?.id || user?._id}
          currentUsername={user?.username}
          category={category}
          loading={loading}
          error={error}
          onRetry={handleRefresh}
        />

      </main>
    </div>
  );
}
