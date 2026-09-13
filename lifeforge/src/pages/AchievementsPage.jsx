import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAchievements,
  getAchievementProgress,
  claimAchievementReward
} from '../services/api';

const CATEGORIES = [
  { id: 'all', label: 'All Trophies', icon: '🏆' },
  { id: 'quest', label: 'Quests', icon: '⚔️' },
  { id: 'goal', label: 'Goals', icon: '📜' },
  { id: 'boss', label: 'Bosses', icon: '👑' },
  { id: 'streak', label: 'Streaks', icon: '🔥' },
  { id: 'xp', label: 'Power & XP', icon: '✨' },
  { id: 'challenge', label: 'Bounties', icon: '🎯' },
  { id: 'social', label: 'Social & Party', icon: '🤝' }
];

export default function AchievementsPage() {
  const { user, token, updateUser } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [progressStats, setProgressStats] = useState({
    totalAchievements: 0,
    unlockedCount: 0,
    lockedCount: 0,
    claimableCount: 0,
    claimedCount: 0,
    completionPercent: 0
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, unlocked, locked, claimable
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [alertNotice, setAlertNotice] = useState(null);

  const fetchAchievementsData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [listRes, statsRes] = await Promise.all([
        getAchievements(token),
        getAchievementProgress(token)
      ]);

      if (listRes && listRes.success) {
        setAchievements(listRes.data || []);
      }
      if (statsRes && statsRes.success && statsRes.data) {
        setProgressStats(statsRes.data);
      }
    } catch (err) {
      console.error('Error loading achievements:', err);
      setAlertNotice({
        type: 'error',
        message: 'Could not connect to database for achievements.'
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAchievementsData();
  }, [fetchAchievementsData]);

  const handleClaimReward = async (ach) => {
    if (!token || claimingId) return;

    try {
      setClaimingId(ach._id);
      const res = await claimAchievementReward(ach._id, token);
      if (res && res.success) {
        setAlertNotice({
          type: 'success',
          message: res.message || `Trophy claimed! +${ach.xpReward} XP awarded!`
        });

        // Update local user state if level up happened
        if (res.data) {
          updateUser({
            xp: res.data.newTotalXp,
            level: res.data.newLevel
          });
        }

        // Re-fetch achievements & progress
        await fetchAchievementsData();
      } else {
        setAlertNotice({
          type: 'error',
          message: res?.message || 'Failed to claim trophy reward'
        });
      }
    } catch (err) {
      console.error('Error claiming reward:', err);
      setAlertNotice({
        type: 'error',
        message: err?.message || 'Error occurred while claiming trophy'
      });
    } finally {
      setClaimingId(null);
    }
  };

  // Filter achievements
  const filteredList = achievements.filter((ach) => {
    if (selectedCategory !== 'all' && ach.category !== selectedCategory) {
      return false;
    }
    if (statusFilter === 'unlocked' && !ach.isUnlocked) {
      return false;
    }
    if (statusFilter === 'locked' && ach.isUnlocked) {
      return false;
    }
    if (statusFilter === 'claimable' && (!ach.isUnlocked || ach.rewardClaimed)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-20 pt-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dark fantasy ambient background glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400/80 uppercase tracking-widest mb-1">
              <Link to="/dashboard" className="hover:text-amber-300 transition-colors">
                Command Center
              </Link>
              <span>/</span>
              <span className="text-slate-400">Hall of Feats</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-rpg tracking-wider text-white flex items-center gap-3">
              <span className="text-amber-400">🏆</span>
              <span>ACHIEVEMENTS & TROPHIES</span>
            </h1>
            <p className="text-sm font-mono text-slate-400 mt-1">
              Conquer real-world challenges, defeat campaign bosses, and claim legendary glory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/character"
              className="px-4 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-xs font-mono text-purple-300 hover:text-white transition-all flex items-center gap-2"
            >
              <span>⚔️ Character Profile</span>
            </Link>
            <Link
              to="/quests"
              className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-xs font-mono text-red-300 hover:text-white transition-all flex items-center gap-2"
            >
              <span>🎯 Quests Board</span>
            </Link>
          </div>
        </div>

        {/* Alert notification banner if present */}
        {alertNotice && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between animate-in fade-in duration-200 ${
              alertNotice.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/60 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-mono">
              <span>{alertNotice.type === 'success' ? '🎉' : '⚠️'}</span>
              <span>{alertNotice.message}</span>
            </div>
            <button
              onClick={() => setAlertNotice(null)}
              className="text-xs font-mono opacity-70 hover:opacity-100 cursor-pointer ml-4"
            >
              Dismiss ✕
            </button>
          </div>
        )}

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-[#1C2333] shadow-lg relative overflow-hidden">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Total Feats
            </div>
            <div className="text-2xl sm:text-3xl font-black font-rpg text-white">
              {progressStats.totalAchievements}
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1">Available in LifeForge</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-emerald-500/30 shadow-lg relative overflow-hidden">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              Unlocked
            </div>
            <div className="text-2xl sm:text-3xl font-black font-rpg text-emerald-400">
              {progressStats.unlockedCount}
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1">
              {progressStats.completionPercent}% Completion
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-amber-500/30 shadow-lg relative overflow-hidden">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Claimable Rewards</span>
              {progressStats.claimableCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-black font-rpg text-amber-400">
              {progressStats.claimableCount}
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1">Ready to claim XP</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-purple-500/30 shadow-lg relative overflow-hidden">
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
              Hero Level
            </div>
            <div className="text-2xl sm:text-3xl font-black font-rpg text-purple-300">
              Lv. {user?.level || 1}
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1">
              Total: {user?.xp || 0} XP
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="p-5 rounded-2xl bg-[#0C0F17] border border-[#1C2333] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <span className="text-amber-400">⚡</span>
              <span>OVERALL TROPHY PROGRESSION</span>
            </span>
            <span className="text-amber-400 font-bold">
              {progressStats.unlockedCount} / {progressStats.totalAchievements} ({progressStats.completionPercent}%)
            </span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-200 shadow-glow-gold"
              style={{ width: `${progressStats.completionPercent}%` }}
            />
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-3">
            {[
              { id: 'all', label: 'All' },
              { id: 'claimable', label: `Claimable (${progressStats.claimableCount})` },
              { id: 'unlocked', label: `Unlocked (${progressStats.unlockedCount})` },
              { id: 'locked', label: `Locked (${progressStats.lockedCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-amber-500 text-black shadow-glow-gold/30'
                    : 'bg-[#111622] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/60'
                    : 'bg-[#0E121B] text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Section: Loading, Empty, or Achievements Grid */}
        {loading ? (
          <div className="p-16 text-center space-y-4 rounded-2xl bg-[#0C0F17] border border-[#1C2333]">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-mono text-slate-400">
              Forging achievement scrolls from the database...
            </p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-16 text-center space-y-3 rounded-2xl bg-[#0C0F17] border border-[#1C2333]">
            <span className="text-4xl">🛡️</span>
            <h3 className="text-lg font-bold font-rpg text-white">No Trophies Found</h3>
            <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
              No achievements match your active filter. Change your filter or complete new quests to unlock heroic feats!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredList.map((item) => {
              const isClaimable = item.isUnlocked && !item.rewardClaimed;
              const isClaimed = item.isUnlocked && item.rewardClaimed;

              return (
                <div
                  key={item._id}
                  className={`rounded-2xl p-5 border transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden group ${
                    isClaimable
                      ? 'bg-[#121724] border-amber-500 shadow-glow-gold/20'
                      : item.isUnlocked
                      ? 'bg-[#0E131E] border-emerald-500/40 hover:border-emerald-400/60'
                      : 'bg-[#090B10] border-slate-800/80 opacity-75 hover:opacity-90'
                  }`}
                >
                  {/* Ambient Glow for unlocked / claimable */}
                  {isClaimable && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
                  )}
                  {isClaimed && (
                    <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div>
                    {/* Header: Icon, Category & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-105 ${
                          isClaimable
                            ? 'bg-amber-950/70 border-amber-500/60 text-amber-300 shadow-glow-gold/30'
                            : item.isUnlocked
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500 grayscale'
                        }`}
                      >
                        {item.icon || '🏆'}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isClaimable
                              ? 'bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse'
                              : isClaimed
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {isClaimable
                            ? '✨ CLAIMABLE'
                            : isClaimed
                            ? '✓ CLAIMED'
                            : 'LOCKED'}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3
                      className={`text-base font-bold font-rpg mb-1.5 ${
                        item.isUnlocked ? 'text-white group-hover:text-amber-200' : 'text-slate-400'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono leading-relaxed line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Progress Bar & Footer */}
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    {/* Progress details */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span className="text-slate-400">
                          Progress: {Math.min(item.currentValue, item.requirementValue)} / {item.requirementValue}
                        </span>
                        <span className="text-amber-400 font-bold">
                          {item.progressPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.isUnlocked
                              ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                              : 'bg-purple-600'
                          }`}
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Reward & Action */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="text-slate-400">Reward:</span>
                        <span className="font-bold text-amber-400">+{item.xpReward} XP</span>
                      </div>

                      {isClaimable ? (
                        <button
                          onClick={() => handleClaimReward(item)}
                          disabled={claimingId === item._id}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs shadow-glow-gold transition-all transform hover:scale-105 cursor-pointer disabled:opacity-50"
                        >
                          {claimingId === item._id ? 'Claiming...' : 'Claim XP ⚔️'}
                        </button>
                      ) : isClaimed ? (
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                          <span>✓</span> Unlocked {item.unlockedAt ? new Date(item.unlockedAt).toLocaleDateString() : ''}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">
                          {item.requirementValue - item.currentValue} more required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
