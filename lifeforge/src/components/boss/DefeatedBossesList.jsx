import React from 'react';

const DEFEATED_DATA = [
  {
    id: 'defeated-1',
    name: 'Fear of Failure',
    icon: '🗿',
    defeatedDate: 'Defeated Sep 05, 2026',
    totalDamageDealt: 1200,
    rewardEarned: '+500 XP & Imposter Slayer Trophy',
    streakEarned: '+3 Streak Boost'
  },
  {
    id: 'defeated-2',
    name: 'Inconsistency Monster',
    icon: '⏳',
    defeatedDate: 'Defeated Aug 28, 2026',
    totalDamageDealt: 800,
    rewardEarned: '+350 XP & Habit Vanguard Sigil',
    streakEarned: '+7-Day Multiplier'
  },
  {
    id: 'defeated-3',
    name: 'Overthinking Dragon',
    icon: '🧠',
    defeatedDate: 'Defeated Aug 18, 2026',
    totalDamageDealt: 1500,
    rewardEarned: '+750 XP & Rapid Executioner Crest',
    streakEarned: '+5 Streak Boost'
  }
];

export default function DefeatedBossesList({ bosses = DEFEATED_DATA }) {
  return (
    <div className="bg-[#0E111A] border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
            <span>HALL OF CONQUERED BOSSES</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
              {bosses.length} Trophies
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Defeated life obstacles commemorated in the permanent LifeForge registry
          </p>
        </div>

        <span className="text-[11px] font-mono text-slate-500 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
          Demo Conquest Ledger
        </span>
      </div>

      {/* Grid of Defeated Bosses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {bosses.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-2xl bg-[#070E0B] border border-emerald-500/30 shadow-lg flex flex-col justify-between group hover:border-emerald-400/60 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <span>🏆</span> CONQUERED
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold font-rpg text-white group-hover:text-emerald-200 transition-colors">
                {item.name}
              </h4>

              <span className="text-[11px] font-mono text-emerald-400/90 block mt-0.5">
                {item.defeatedDate}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-950/80 space-y-1 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Total Damage:</span>
                <span className="font-bold text-red-400">-{item.totalDamageDealt.toLocaleString()} HP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Bounty Claimed:</span>
                <span className="font-bold text-amber-300 text-[11px] truncate max-w-[150px]">{item.rewardEarned}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
