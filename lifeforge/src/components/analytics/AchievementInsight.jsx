import React from 'react';
import { Link } from 'react-router-dom';

export default function AchievementInsight() {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-neutral-900/90 via-amber-950/20 to-neutral-900/90 p-5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0">
          🏆
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif font-bold text-white text-base">
              Milestone Unlocked: Habit Vanguard
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Rare
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            You completed 7 consecutive days without failing a single primary goal quest.
          </p>
        </div>
      </div>

      <Link
        to="/character"
        className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 transition-all shadow-md hover:shadow-amber-500/20 text-center shrink-0"
      >
        View Full Character Profile & Badges →
      </Link>
    </div>
  );
}
