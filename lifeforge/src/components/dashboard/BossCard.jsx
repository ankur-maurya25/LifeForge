import React from 'react';
import { Link } from 'react-router-dom';

export default function BossCard({
  bossName = 'THE PROCRASTINATION KING',
  goalTitle = 'Build My First Full-Stack Project',
  hpPercentage = 72,
  daysRemaining = 18,
  completedMilestones = 4,
  totalMilestones = 10,
  onViewBattle
}) {
  return (
    <div className="bg-[#0E111A] border border-red-900/40 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden group">
      
      {/* Ambient Crimson Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag & Status */}
      <div className="flex items-center justify-between gap-2 mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
            YOUR ACTIVE BOSS
          </span>
        </div>
        <span className="text-xs font-mono text-amber-400 font-bold px-2.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
          ⏳ {daysRemaining} days remaining
        </span>
      </div>

      {/* Active Campaign Goal Title */}
      <div className="mb-6 relative z-10 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase">Target Campaign</span>
          <Link
            to="/goal-details"
            className="block text-lg sm:text-2xl font-bold font-rpg text-white hover:text-amber-400 transition-colors mt-0.5"
            title="View Complete Goal Details"
          >
            “{goalTitle}” →
          </Link>
        </div>
      </div>

      {/* Boss Encounter Visual + HP Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center p-4 rounded-xl bg-[#07080E] border border-red-900/30 mb-6 relative z-10">
        
        {/* Fictional Boss Emblem */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-b from-[#1C080E] to-[#08080C] border border-red-500/30 shadow-glow-crimson">
          <svg className="w-16 h-16 text-red-500" viewBox="0 0 100 100" fill="none">
            {/* Horns & Crown */}
            <path d="M25 40 L35 20 L45 32 L50 15 L55 32 L65 20 L75 40 L70 60 L30 60 Z" fill="#24070A" stroke="#EF4444" strokeWidth="2" />
            <circle cx="50" cy="24" r="3" fill="#F59E0B" />
            {/* Glowing Eyes */}
            <circle cx="42" cy="45" r="3.5" fill="#EF4444" className="animate-pulse" />
            <circle cx="58" cy="45" r="3.5" fill="#EF4444" className="animate-pulse" />
            {/* Jaw */}
            <path d="M38 52 Q50 64 62 52" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] font-mono font-bold text-red-400 mt-1">
            Nemesis Lv. 15
          </span>
        </div>

        {/* Boss Details & HP Bar */}
        <div className="sm:col-span-8 space-y-3">
          <div>
            <h4 className="text-base font-bold font-rpg text-white tracking-wide">
              {bossName}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">
              Feeds on delays • Weak to daily coding sprints
            </p>
          </div>

          {/* HP Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono font-bold mb-1">
              <span className="text-red-400 flex items-center gap-1">
                <span>🔥</span> BOSS VITALITY
              </span>
              <span className="text-slate-200">
                {hpPercentage}% HP REMAINING
              </span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-red-700 via-red-500 to-amber-500 shadow-glow-crimson"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Footer: Milestones & Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80 relative z-10">
        <div>
          <span className="text-[11px] font-mono text-slate-400 block">Milestones Cleared:</span>
          <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
            <span className="text-emerald-400">⚔</span> {completedMilestones} of {totalMilestones} milestones
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/goal-details"
            className="px-3.5 py-2.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:border-purple-500/50 transition-colors"
          >
            Goal Details
          </Link>

          <Link
            to="/boss-battle"
            onClick={onViewBattle}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-red-800 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/50 flex items-center gap-2 cursor-pointer"
          >
            <span>View Boss Battle</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>

    </div>
  );
}
