import React, { useState } from 'react';

export default function PartyChallengeCard({
  title = 'Complete 25 Quests Together',
  progress = 17,
  target = 25,
  reward = '+800 Party XP',
}) {
  const [showDetails, setShowDetails] = useState(false);
  const percentage = Math.round((progress / target) * 100);

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-neutral-900/90 via-purple-950/20 to-neutral-900/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">
              Weekly Party Challenge
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Active Quest
            </span>
          </div>
          <p className="text-sm text-neutral-200 mt-1 font-semibold">
            {title}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
            Reward: {reward}
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'View Challenge'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-neutral-400">Progress: {progress}/{target}</span>
          <span className="text-purple-300 font-bold">{percentage}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-neutral-800 border border-white/10 overflow-hidden">
          <div
            style={{ width: `${percentage}%` }}
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          />
        </div>
      </div>

      {/* Demo details section */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-neutral-300 animate-in fade-in duration-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Challenge Details & Rules:</span>
            <span className="text-[11px] text-neutral-400">Ends in 3 days</span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Team up with your party members! Every completed daily habit or task counts toward the 25 total quests goal. Once achieved, all active members earn +800 Party XP and boost their guild rank.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <span className="text-neutral-400 block text-[10px]">Ankur Maurya (You)</span>
              <span className="text-amber-400 font-bold font-mono">7 quests completed</span>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <span className="text-neutral-400 block text-[10px]">Aryan Sharma</span>
              <span className="text-amber-400 font-bold font-mono">6 quests completed</span>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <span className="text-neutral-400 block text-[10px]">Riya Sen</span>
              <span className="text-amber-400 font-bold font-mono">4 quests completed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
