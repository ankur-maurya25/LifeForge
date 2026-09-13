import React from 'react';
import { Link } from 'react-router-dom';

export default function CharacterHeader({
  character,
  onGainDemoXp
}) {
  const {
    name = 'Ankur',
    title = 'The Goal Crusher',
    level = 8,
    currentXp = 640,
    maxXp = 1000,
    rank = 'RISING BUILDER',
    characterClass = 'Architect of Systems & Code'
  } = character;

  const xpPercentage = Math.min(100, Math.round((currentXp / maxXp) * 100));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0E111A] border border-[#1E2538] p-6 sm:p-8 shadow-2xl">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Avatar + Identification */}
        <div className="flex items-center gap-5 sm:gap-6">
          
          {/* RPG Avatar Frame */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-br from-red-600 via-purple-600 to-amber-500 shadow-glow-crimson">
              <div className="w-full h-full rounded-[22px] bg-[#07080E] flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Subtle runic glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 to-transparent pointer-events-none" />
                
                {/* Character Icon / Avatar placeholder */}
                <span className="text-3xl sm:text-4xl font-rpg font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 select-none">
                  {name.charAt(0)}
                </span>
                
                <span className="text-[9px] font-mono text-purple-300 font-bold uppercase tracking-wider mt-0.5">
                  Champion
                </span>
              </div>
            </div>

            {/* Level Tag */}
            <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 border border-[#0E111A] text-[11px] font-mono font-bold text-white shadow-lg flex items-center gap-1">
              <span>Lv.</span>
              <span>{level}</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-bold font-rpg text-white tracking-wide">
                {name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-950/50 border border-amber-500/40 text-amber-300">
                {title}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-mono flex items-center gap-2">
              <span className="text-purple-400 font-semibold">{rank}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{characterClass}</span>
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Campaign: “Build My First Full-Stack Project”</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Demo Control */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-end">
          <button
            onClick={onGainDemoXp}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 hover:border-amber-500/60 transition-all shadow-glow-gold/10 flex items-center gap-2 cursor-pointer active:scale-95"
            title="Simulate earning XP in local demo state"
          >
            <span>⚡</span>
            <span>Test Gain +50 XP</span>
          </button>

          <Link
            to="/quests"
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>📋</span>
            <span>Quest Board</span>
          </Link>
        </div>
      </div>

      {/* Bottom: XP Bar & Level Unlock Note */}
      <div className="mt-6 pt-6 border-t border-slate-800/80 relative z-10 space-y-2">
        <div className="flex flex-wrap justify-between items-center text-xs font-mono gap-2">
          <span className="text-slate-300 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>CHARACTER EXPERIENCE</span>
          </span>
          <span className="text-amber-400 font-bold">
            {currentXp} / {maxXp} XP ({xpPercentage}%)
          </span>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 shadow-glow-gold/30 transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span className="text-purple-300 font-semibold flex items-center gap-1">
            <span>✨</span> Next level unlocks a new skill
          </span>
          <span>
            {maxXp - currentXp} XP remaining until Level {level + 1}
          </span>
        </div>
      </div>
    </div>
  );
}
