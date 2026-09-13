import React from 'react';

export default function BossDamageSection({
  bossesDefeated = 0,
  activeBosses = 0,
  totalGoals = 0,
  activeBossName = 'The Procrastination Demon',
  bossProgress = 0
}) {
  const hpRemainingPct = Math.max(5, 100 - (bossProgress || 0));

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide">
            Boss Battle Impact
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300">
          {activeBosses > 0 ? `${activeBosses} Active Nemesis` : 'Resting Titan'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-[11px] text-neutral-400 font-mono">Bosses Defeated</div>
          <div className="font-mono text-base font-bold text-amber-400 mt-0.5">{bossesDefeated} Vanquished</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-[11px] text-neutral-400 font-mono">Active Campaigns</div>
          <div className="font-mono text-base font-bold text-purple-300 mt-0.5">{activeBosses} In Battle</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-neutral-400 font-mono">Total Campaigns</div>
          <div className="font-mono text-base font-bold text-emerald-400 mt-0.5">{totalGoals} Goals</div>
        </div>
      </div>

      {/* Target Boss HP Bar */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/20 via-purple-950/20 to-black/40 border border-red-500/20">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-white font-medium font-mono truncate max-w-[200px]">
              Nemesis: {activeBossName}
            </span>
          </div>
          <span className="font-mono text-red-400 font-bold shrink-0">
            {hpRemainingPct}% HP Remaining
          </span>
        </div>

        <div className="h-3 rounded-full bg-neutral-900 border border-red-500/30 overflow-hidden">
          <div
            style={{ width: `${hpRemainingPct}%` }}
            className="h-full bg-gradient-to-r from-red-700 via-rose-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
          />
        </div>
        <p className="text-[11px] text-neutral-400 mt-2 font-mono">
          Completing milestones and daily quests directly depletes this boss's vitality pool.
        </p>
      </div>
    </div>
  );
}
