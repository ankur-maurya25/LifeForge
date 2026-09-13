import React, { useState } from 'react';

export default function WeeklyChallengeCard({
  challenge = {
    title: 'Complete 10 Quests This Week',
    reward: '+500 XP',
    current: 6,
    target: 10,
    status: 'In Progress',
    daysRemaining: 3
  }
}) {
  const [showDetails, setShowDetails] = useState(false);
  const percentage = Math.round((challenge.current / challenge.target) * 100);

  return (
    <div className="rounded-3xl bg-[#0E111A] border border-amber-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Ambient amber glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        
        {/* Left Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm">🏆</span>
            <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
              WEEKLY GUILD CHALLENGE
            </span>
            <span className="text-[10px] font-mono text-slate-400 px-2 py-0.2 rounded bg-slate-900 border border-slate-800">
              ⏳ {challenge.daysRemaining} days left
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide">
            {challenge.title}
          </h3>

          <p className="text-xs text-slate-400 font-mono">
            Clear daily boss actions to unlock the communal XP treasury bonus for all participants.
          </p>
        </div>

        {/* Right: Progress & Action */}
        <div className="w-full md:w-72 shrink-0 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <span>Progress:</span>
              <span className="text-amber-400 font-bold">
                {challenge.current}/{challenge.target} completed
              </span>
            </span>

            <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
              {challenge.reward}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 shadow-glow-gold/30 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {challenge.status} ({percentage}%)
            </span>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer transition-colors"
            >
              {showDetails ? 'Hide Details' : 'View Challenge'}
            </button>
          </div>
        </div>

      </div>

      {/* Inline Expandable Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 animate-in fade-in duration-200">
          <div className="p-3 rounded-xl bg-[#07080E] border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Requirement</span>
            <span className="font-semibold text-slate-200">10 daily quests checked off before Sunday midnight.</span>
          </div>
          <div className="p-3 rounded-xl bg-[#07080E] border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Reward Distribution</span>
            <span className="font-semibold text-amber-300">+500 XP directly applied to character level progress.</span>
          </div>
          <div className="p-3 rounded-xl bg-[#07080E] border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Community Rank</span>
            <span className="font-semibold text-purple-300">Top 15% pace among active questers this week.</span>
          </div>
        </div>
      )}
    </div>
  );
}
