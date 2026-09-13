import React from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedBossCard({
  bossName = 'Procrastination Beast',
  level = 15,
  currentHp = 720,
  maxHp = 1000,
  daysRemaining = 18
}) {
  const hpPercentage = Math.round((currentHp / maxHp) * 100);
  const remainingDamage = currentHp;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#180A0E] via-[#100D18] to-[#07080E] border border-red-900/50 p-6 sm:p-8 shadow-2xl group">
      {/* Crimson and void energetic glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Emblem + Identification */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          
          {/* Boss Crest Avatar */}
          <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-b from-[#2A0A10] to-[#0A060A] border border-red-500/50 flex flex-col items-center justify-center p-3 shrink-0 shadow-glow-crimson group-hover:border-red-400 transition-colors">
            <span className="text-3xl sm:text-4xl animate-pulse">🐉</span>
            <span className="text-[9px] font-mono font-bold text-red-400 uppercase mt-0.5 tracking-wider">
              Lv.{level} Titan
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-950/70 text-red-300 border border-red-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                CURRENT MAIN BOSS
              </span>

              <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
                ⏳ {daysRemaining} days remaining
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-rpg text-white tracking-wide truncate">
              {bossName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-mono">
              Feeds on delays • Weak to daily coding sprints & focused pomodoros.
            </p>
          </div>
        </div>

        {/* Right: Continue Battle Action Button */}
        <div className="shrink-0 self-stretch md:self-auto">
          <Link
            to="/boss-battle"
            className="w-full md:w-auto px-7 py-3.5 rounded-2xl font-bold font-rpg text-xs text-white bg-gradient-to-r from-red-800 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/50 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>⚔️</span>
            <span>Continue Battle</span>
            <span>→</span>
          </Link>
        </div>

      </div>

      {/* Bottom: HP Bar & Remaining Damage */}
      <div className="mt-6 pt-6 border-t border-slate-800/80 relative z-10 space-y-2">
        <div className="flex flex-wrap justify-between items-center text-xs font-mono gap-2">
          <span className="text-red-400 font-bold flex items-center gap-1.5">
            <span>🔥</span> BOSS VITALITY: {currentHp} / {maxHp} HP
          </span>
          <span className="text-amber-300 font-semibold">
            {remainingDamage} HP damage required to conquer
          </span>
        </div>

        <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-amber-500 shadow-glow-crimson transition-all duration-500"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
