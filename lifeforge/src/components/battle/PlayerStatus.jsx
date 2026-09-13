import React from 'react';

export default function PlayerStatus({
  playerName = 'Ankur',
  level = 'LEVEL 08',
  currentXp = 640,
  maxXp = 1000,
  rank = 'RISING BUILDER',
  stats = { coding: 72, focus: 64, discipline: 58 }
}) {
  const xpPercentage = Math.round((currentXp / maxXp) * 100);

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-glow-gold/20">
          <div className="w-full h-full rounded-[10px] bg-[#0B0D14] flex items-center justify-center text-lg font-rpg font-bold text-amber-400">
            {playerName.charAt(0)}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold font-rpg text-white truncate">
              {playerName}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/50 border border-amber-500/30 text-amber-300">
              {level}
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Rank: <strong className="text-white">{rank}</strong>
          </p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            HERO COMBAT XP
          </span>
          <span className="text-amber-400 font-bold">
            {currentXp} / {maxXp} XP ({xpPercentage}%)
          </span>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 to-amber-300 shadow-glow-gold"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      {/* Attributes: Coding, Focus, Discipline */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-[#141824] border border-blue-500/30">
          <span className="text-[10px] text-slate-400 block uppercase">Coding</span>
          <span className="text-base font-black font-rpg text-blue-400">{stats.coding}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141824] border border-purple-500/30">
          <span className="text-[10px] text-slate-400 block uppercase">Focus</span>
          <span className="text-base font-black font-rpg text-purple-400">{stats.focus}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141824] border border-red-500/30">
          <span className="text-[10px] text-slate-400 block uppercase">Discipline</span>
          <span className="text-base font-black font-rpg text-red-400">{stats.discipline}</span>
        </div>
      </div>

    </div>
  );
}
