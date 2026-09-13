import React from 'react';
import { Link } from 'react-router-dom';

export default function CompletionState({
  totalXp = 150,
  totalDamage = 200
}) {
  return (
    <div className="bg-gradient-to-b from-[#0E1A14] via-[#0B1410] to-[#070A08] border border-emerald-500/50 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden my-6 animate-in zoom-in-95 duration-300">
      {/* Radiant emerald glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto space-y-4">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/70 border border-emerald-400/50 flex items-center justify-center mx-auto text-3xl shadow-glow-gold/20">
          🏆
        </div>

        {/* Headings */}
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            VICTORY ACHIEVED
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-rpg text-white mt-1">
            Challenge Completed!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
            You earned your rewards and damaged the boss.
          </p>
        </div>

        {/* Stats banner */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#060D09] border border-emerald-500/30 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Total XP Claimed</span>
            <span className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <span>⚡</span> +{totalXp} XP
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Total Boss Damage</span>
            <span className="text-lg font-bold text-red-400 flex items-center justify-center gap-1 mt-0.5">
              <span>🔥</span> -{totalDamage} HP
            </span>
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 rounded-2xl font-bold font-rpg text-xs text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 active:scale-95 transition-all shadow-glow-gold/20 border border-emerald-400/40"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
