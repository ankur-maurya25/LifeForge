import React from 'react';

export default function BossSummaryRow({
  totalBosses = 6,
  activeBosses = 2,
  defeatedBosses = 3,
  totalDamageDealt = 3850
}) {
  const cards = [
    {
      label: 'Total Bosses',
      value: `${totalBosses} Nemeses`,
      subtext: 'Catalogued life obstacles',
      icon: '🐉',
      style: 'border-purple-500/30 bg-purple-950/20 text-purple-400'
    },
    {
      label: 'Active Bosses',
      value: `${activeBosses} Confronted`,
      subtext: 'Currently receiving quest damage',
      icon: '🔥',
      style: 'border-red-500/40 bg-red-950/20 text-red-400'
    },
    {
      label: 'Defeated Bosses',
      value: `${defeatedBosses} Conquered`,
      subtext: 'Hall of conquest trophies',
      icon: '🏆',
      style: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
    },
    {
      label: 'Total Damage Dealt',
      value: `${totalDamageDealt.toLocaleString()} HP`,
      subtext: 'Cumulative strike output',
      icon: '⚔️',
      style: 'border-amber-500/30 bg-amber-950/20 text-amber-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-xl ${c.style} flex flex-col justify-between`}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
              {c.label}
            </span>
            <span className="text-xl shrink-0">{c.icon}</span>
          </div>

          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold font-rpg text-white tracking-tight">
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
