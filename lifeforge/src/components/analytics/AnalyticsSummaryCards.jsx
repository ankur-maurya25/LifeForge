import React from 'react';

export default function AnalyticsSummaryCards({
  totalXp = 0,
  level = 1,
  nextLevelXp = 500,
  questsCompleted = 0,
  totalQuests = 0,
  questCompletionRate = 0,
  currentStreak = 0,
  longestStreak = 0,
  bossesDefeated = 0,
  activeBosses = 0,
  challengesCompleted = 0
}) {
  const cards = [
    {
      label: 'Total XP Earned',
      value: typeof totalXp === 'number' ? `${totalXp.toLocaleString()} XP` : totalXp,
      subtext: `Level ${level} • Next: ${nextLevelXp} XP`,
      icon: '⚡',
      accent: 'border-amber-500/30 bg-amber-950/20 text-amber-400'
    },
    {
      label: 'Quests Completed',
      value: `${questsCompleted} / ${totalQuests}`,
      subtext: `${questCompletionRate}% clearance rate`,
      icon: '✓',
      accent: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} Days`,
      subtext: `Best: ${longestStreak} consecutive days`,
      icon: '🔥',
      accent: 'border-red-500/30 bg-red-950/20 text-red-400'
    },
    {
      label: 'Bosses Vanquished',
      value: `${bossesDefeated} Defeated`,
      subtext: `${activeBosses} active boss campaigns`,
      icon: '🐉',
      accent: 'border-purple-500/30 bg-purple-950/20 text-purple-400'
    },
    {
      label: 'Daily Bounties',
      value: `${challengesCompleted} Cleared`,
      subtext: 'Daily challenges conquered',
      icon: '✨',
      accent: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-xl ${c.accent} flex flex-col justify-between`}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
              {c.label}
            </span>
            <span className="text-xl shrink-0">{c.icon}</span>
          </div>

          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-bold font-rpg text-white tracking-tight truncate">
              {c.value}
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
              {c.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
