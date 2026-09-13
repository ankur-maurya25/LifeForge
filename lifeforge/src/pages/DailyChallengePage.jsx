import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTodayChallenge, completeDailyChallenge, getChallengeHistory } from '../services/api';
import ChallengeMainCard from '../components/challenge/ChallengeMainCard';
import MissionBrief from '../components/challenge/MissionBrief';
import TaskChecklist from '../components/challenge/TaskChecklist';
import BossDamagePreview from '../components/challenge/BossDamagePreview';
import RewardPreview from '../components/challenge/RewardPreview';
import CompletionState from '../components/challenge/CompletionState';

const INITIAL_TASKS = [
  {
    id: 'task-1',
    name: 'Study or work for 25 minutes',
    description: 'Execute one pomodoro sprint of pure coding, reading, or deep concentration.',
    xp: 40,
    completed: false
  },
  {
    id: 'task-2',
    name: 'Complete one important pending task',
    description: 'Tackle the highest-friction item on your checklist before noon.',
    xp: 40,
    completed: false
  },
  {
    id: 'task-3',
    name: 'Avoid distractions during focused work',
    description: 'Keep notification streams silenced and social tabs closed throughout your work block.',
    xp: 35,
    completed: false
  },
  {
    id: 'task-4',
    name: 'Review today’s progress',
    description: 'Audit completed quest outputs and prepare the next day’s tactical priorities.',
    xp: 35,
    completed: false
  }
];

export default function DailyChallengePage() {
  const { user, token, updateUser } = useAuth();

  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [notice, setNotice] = useState(null);

  // Backend Daily Challenge State
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);

  // Challenge History State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch today's challenge from backend
  const fetchChallenge = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await getTodayChallenge(token);
      if (res && res.success && res.data) {
        setChallenge(res.data);
        if (res.data.status === 'completed') {
          setTasks((prev) => prev.map((t) => ({ ...t, completed: true })));
        }
      } else {
        setError(res?.message || 'Unable to load today’s daily challenge.');
      }
    } catch (err) {
      console.error('Error fetching daily challenge:', err);
      setError('Backend database is currently offline or unreachable. Using local challenge mode.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch past challenges history
  const fetchHistory = useCallback(async () => {
    if (!token) return;
    setLoadingHistory(true);
    try {
      const res = await getChallengeHistory(token);
      if (res && res.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Error fetching challenge history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [token]);

  useEffect(() => {
    fetchChallenge();
    fetchHistory();
  }, [fetchChallenge, fetchHistory]);

  // Derived metrics
  const completedCount = useMemo(() => {
    return tasks.filter((t) => t.completed).length;
  }, [tasks]);

  const totalCount = tasks.length;
  const isChallengeCompleted = challenge?.status === 'completed' || completedCount === totalCount;

  // Action: Toggle Individual Task
  const handleToggleTask = (taskId) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return { ...t, completed: nextCompleted };
        }
        return t;
      });

      const nextCompletedCount = updated.filter((t) => t.completed).length;
      if (nextCompletedCount === totalCount) {
        setNotice('🎉 Outstanding! All daily tasks complete. Procrastination Beast took critical damage!');
      } else {
        const target = updated.find((t) => t.id === taskId);
        setNotice(
          target.completed
            ? `⚔️ Task checked! Earned +${target.xp} XP and dealt -50 Boss Damage.`
            : `Task unchecked. Boss vitality restored.`
        );
      }

      return updated;
    });
  };

  // Action: Complete Challenge Button
  const handleCompleteChallenge = async () => {
    if (isChallengeCompleted) {
      setNotice('🛡️ Daily challenge is already completed for today!');
      return;
    }

    if (!challenge?._id || !token) {
      // Offline fallback
      setTasks((prev) => prev.map((t) => ({ ...t, completed: true })));
      setNotice('🏆 Challenge Completed (Demo Mode)! Daily rewards granted.');
      return;
    }

    setCompleting(true);
    setError('');

    try {
      const res = await completeDailyChallenge(challenge._id, token);
      if (res && res.success) {
        setChallenge(res.data.challenge);
        if (res.data.user && updateUser) {
          updateUser(res.data.user);
        }
        setTasks((prev) => prev.map((t) => ({ ...t, completed: true })));
        setNotice(
          `🏆 Challenge Completed! ${res.message || 'Streak updated!'} +${challenge.xpReward} XP awarded!`
        );
        fetchHistory();
      } else {
        setNotice(`⚠️ ${res?.message || 'Failed to complete challenge.'}`);
      }
    } catch (err) {
      console.error('Error completing challenge:', err);
      setNotice(`⚠️ ${err.message || 'Network error while completing challenge.'}`);
    } finally {
      setCompleting(false);
    }
  };

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
                <span className="text-amber-400 text-sm">⚡</span>
                <h1 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide">
                  DAILY CHALLENGE
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-500/40">
                  {challenge?.status === 'completed' ? '✓ Completed' : 'Active Challenge'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block">
                  📅 {challenge?.challengeDate || 'Today'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Complete today’s mission to maintain streak and defeat obstacles
              </p>
            </div>
          </div>

          {/* Streak Display & Navigation Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Streak Counter Badges */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-950/50 to-red-950/50 border border-orange-500/40 text-xs font-mono">
              <span className="text-amber-400">🔥</span>
              <span className="font-bold text-white">{user?.streak || 0} Day Streak</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 text-[11px]">Best: {user?.longestStreak || user?.streak || 0}d</span>
            </div>

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
          </div>

        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Dynamic Notice Banner */}
        {notice && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-200 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>{notice}</span>
            </div>
            <button
              onClick={() => setNotice(null)}
              className="text-slate-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Database Error Banner */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={fetchChallenge}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs hover:bg-slate-800 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-slate-400 space-y-3">
            <div className="w-8 h-8 mx-auto border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p>Summoning today’s daily challenge from the backend engine...</p>
          </div>
        ) : (
          <>
            {/* 1. MAIN CHALLENGE CARD */}
            <ChallengeMainCard
              title={challenge?.title || 'Build Your Daily Momentum'}
              description={challenge?.description || 'Execute today’s tactical discipline routine to reinforce habit streaks and blast the daily boss.'}
              difficulty={challenge?.difficulty || 'Medium'}
              xpReward={challenge?.xpReward || 50}
              challengeDate={challenge?.challengeDate}
              completedCount={completedCount}
              totalCount={totalCount}
              isChallengeCompleted={isChallengeCompleted}
              onCompleteChallenge={handleCompleteChallenge}
              isCompleting={completing}
              streak={user?.streak || 0}
              longestStreak={user?.longestStreak || user?.streak || 0}
            />

            {/* 2. COMPLETION STATE (rendered when challenge is completed) */}
            {isChallengeCompleted && (
              <CompletionState
                totalXp={challenge?.xpReward || 150}
                totalDamage={200}
              />
            )}

            {/* 3. 2-COLUMN LAYOUT: Checklist & Boss / Rewards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: Task Checklist & Mission Brief (7 COLS) */}
              <div className="lg:col-span-7 space-y-8">
                <TaskChecklist
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                />

                <MissionBrief />
              </div>

              {/* Right: Boss Damage Preview & Rewards (5 COLS) */}
              <div className="lg:col-span-5 space-y-8">
                <BossDamagePreview
                  bossName="Procrastination Beast"
                  maxHp={600}
                  damagePerTask={50}
                  completedTasksCount={completedCount}
                  totalTasksCount={totalCount}
                />

                <RewardPreview />
              </div>

            </div>

            {/* 4. CHALLENGE HISTORY SECTION */}
            <div className="rounded-3xl bg-[#0E111A] border border-[#1E2538] p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📜</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-rpg text-white">
                      DAILY CHALLENGE ARCHIVE & STREAK LOG
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Your historical discipline record and past trials
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {showHistory ? 'Hide History ▲' : `View Past Challenges (${history.length}) ▼`}
                </button>
              </div>

              {showHistory && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  {loadingHistory ? (
                    <div className="py-6 text-center text-xs font-mono text-slate-400">
                      Loading challenge history...
                    </div>
                  ) : history.length === 0 ? (
                    <div className="py-6 text-center text-xs font-mono text-slate-500">
                      No past challenges recorded yet. Complete today’s challenge to forge your streak!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {history.map((h) => (
                        <div
                          key={h._id || h.id}
                          className="p-3.5 rounded-2xl bg-[#07080E] border border-slate-800/80 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-bold text-white truncate">
                                {h.title}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                  h.status === 'completed'
                                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                {h.status === 'completed' ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                              <span>📅 {h.challengeDate}</span>
                              <span>•</span>
                              <span>{h.difficulty}</span>
                              <span>•</span>
                              <span className="text-amber-400 font-bold">+{h.xpReward} XP</span>
                            </div>
                          </div>

                          <div className="text-xl shrink-0">
                            {h.status === 'completed' ? '🏆' : '⏳'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}
