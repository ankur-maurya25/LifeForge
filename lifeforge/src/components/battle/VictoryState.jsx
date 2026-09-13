import React from 'react';
import { Link } from 'react-router-dom';

export default function VictoryState({
  bossName = 'THE PROCRASTINATION KING',
  goalTitle = 'Build My First Full-Stack Project',
  onReset
}) {
  return (
    <div className="bg-[#0E111A] border-2 border-amber-500/50 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
      
      {/* Radiant celebratory background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        
        {/* Trophy Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-200 border-2 border-amber-300 flex items-center justify-center mx-auto mb-6 shadow-glow-gold">
          <span className="text-4xl">🏆</span>
        </div>

        {/* Headings */}
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40">
          Campaign Conquered
        </span>

        <h2 className="text-3xl sm:text-4xl font-black font-rpg text-white mt-4 mb-2 tracking-wide">
          BOSS DEFEATED
        </h2>

        <p className="text-base text-slate-300 font-normal mb-6">
          You turned your goal into reality.
        </p>

        {/* Encounter Details */}
        <div className="p-4 rounded-xl bg-[#141824] border border-slate-800 mb-6 text-xs font-mono text-slate-300 space-y-1 text-left">
          <div>Vanquished: <strong className="text-red-400">{bossName}</strong></div>
          <div>Goal Fulfilled: <strong className="text-white">“{goalTitle}”</strong></div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-amber-400 font-bold">
            <span>Victory Bounty:</span>
            <span className="text-sm">+500 XP & Grandmaster Badge</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/50 font-mono uppercase tracking-wider"
          >
            Return to Dashboard
          </Link>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors font-mono uppercase cursor-pointer"
          >
            Replay Demo Battle
          </button>
        </div>

        <p className="text-[10px] font-mono text-slate-500 mt-4">
          Local demo simulation state • No database modified
        </p>

      </div>

    </div>
  );
}
