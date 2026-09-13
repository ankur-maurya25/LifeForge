import React from 'react';

export default function AdminSummaryCards({ totalUsers = 128, activeQuests = 24, totalBosses = 12, totalAchievements = 36 }) {
  const cards = [
    {
      label: 'Total Users',
      value: totalUsers,
      subtext: 'Registered realm adventurers',
      icon: '👤',
      border: 'border-blue-500/30',
      bg: 'from-blue-950/20 to-neutral-900/80',
      text: 'text-blue-400'
    },
    {
      label: 'Active Quests',
      value: activeQuests,
      subtext: 'Available across all boards',
      icon: '⚔️',
      border: 'border-amber-500/30',
      bg: 'from-amber-950/20 to-neutral-900/80',
      text: 'text-amber-400'
    },
    {
      label: 'Total Bosses',
      value: totalBosses,
      subtext: 'World & dungeon threats',
      icon: '🐉',
      border: 'border-red-500/30',
      bg: 'from-red-950/20 to-neutral-900/80',
      text: 'text-red-400'
    },
    {
      label: 'Achievements',
      value: totalAchievements,
      subtext: 'Unlockable master badges',
      icon: '🏆',
      border: 'border-purple-500/30',
      bg: 'from-purple-950/20 to-neutral-900/80',
      text: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`p-4 sm:p-5 rounded-2xl border ${card.border} bg-gradient-to-b ${card.bg} backdrop-blur-xl shadow-lg hover:border-opacity-60 transition-all`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-mono">
              {card.label}
            </span>
            <span className="text-xl">{card.icon}</span>
          </div>
          <div className={`font-mono text-2xl sm:text-3xl font-black ${card.text}`}>
            {card.value}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {card.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
