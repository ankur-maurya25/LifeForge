import React from 'react';

export default function PlayerOverview({
  playerName = 'Ankur',
  level = 8,
  currentXp = 640,
  maxXp = 1000,
  rank = 'RISING BUILDER',
  stats = { discipline: 72, focus: 64, consistency: 58 }
}) {
  const xpPercentage = Math.round((currentXp / maxXp) * 100);

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header: Avatar & Player Identification */}
      <div className="flex items-center gap-4 mb-5 relative z-10">
        {/* Avatar with glowing border */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-purple-700 to-amber-600 p-0.5 shadow-glow-gold/30">
            <div className="w-full h-full rounded-2xl bg-[#0B0D14] flex items-center justify-center text-xl font-rpg font-bold text-amber-400">
              {playerName.charAt(0)}
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-[10px] font-mono font-bold text-white border border-[#0E111A]">
            Lv.{level}
          </span>
        </div>

        {/* Name & Rank */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold font-rpg text-white truncate">
              {playerName}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-950/50 border border-amber-500/40 text-amber-300">
              {rank}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Class: Master of Systems & Code
          </p>
        </div>
      </div>

      {/* XP Bar Progress */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            LEVEL 08 PROGRESS
          </span>
          <span className="text-amber-400 font-bold">
            {currentXp} / {maxXp} XP ({xpPercentage}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div 
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-200 shadow-glow-gold"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      {/* 3 Core Stats: Discipline, Focus, Consistency */}
      <div className="grid grid-cols-3 gap-2.5 relative z-10">
        
        {/* Discipline */}
        <div className="p-3 rounded-xl bg-[#141824] border border-red-500/30 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
            Discipline
          </div>
          <div className="text-lg font-black font-rpg text-red-400">
            {stats.discipline}
          </div>
          <span className="text-[9px] font-mono text-slate-500">Tier A</span>
        </div>

        {/* Focus */}
        <div className="p-3 rounded-xl bg-[#141824] border border-purple-500/30 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
            Focus
          </div>
          <div className="text-lg font-black font-rpg text-purple-400">
            {stats.focus}
          </div>
          <span className="text-[9px] font-mono text-slate-500">Tier A</span>
        </div>

        {/* Consistency */}
        <div className="p-3 rounded-xl bg-[#141824] border border-amber-500/30 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
            Consistency
          </div>
          <div className="text-lg font-black font-rpg text-amber-400">
            {stats.consistency}
          </div>
          <span className="text-[9px] font-mono text-slate-500">Tier B+</span>
        </div>

      </div>
    </div>
  );
}
