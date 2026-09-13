import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BossDetailsModal({
  isOpen,
  boss,
  onClose,
  onStartBattle
}) {
  if (!isOpen || !boss) return null;

  const {
    name,
    description,
    difficulty,
    currentHp,
    maxHp,
    weakness,
    reward,
    recommendedAction,
    status,
    icon
  } = boss;

  const hpPercentage = Math.round((currentHp / maxHp) * 100);
  const isDefeated = status === 'Defeated';
  const isLocked = status === 'Locked';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#0B0D14] border border-red-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-3xl shadow-glow-crimson/20">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/70 text-red-300 border border-red-500/40">
                  {difficulty} Tier
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Status: <strong className="text-white">{status}</strong>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-rpg text-white mt-0.5">
                {name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed mb-5 relative z-10">
          {description}
        </p>

        {/* Vitality Bar */}
        <div className="p-4 rounded-2xl bg-[#07080E] border border-slate-800/80 mb-5 relative z-10 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 font-semibold">Boss Vitality Gauge</span>
            <span className="text-amber-400 font-bold">
              {currentHp} / {maxHp} HP ({hpPercentage}%)
            </span>
          </div>

          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDefeated
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                  : 'bg-gradient-to-r from-red-700 via-red-500 to-amber-500'
              }`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        {/* Tactical Intel Matrix: Weakness, Reward, Recommended Action */}
        <div className="space-y-3 mb-6 relative z-10 text-xs font-mono">
          {/* Weakness */}
          <div className="p-3.5 rounded-xl bg-[#07080E] border border-red-900/30">
            <span className="text-red-400 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
              ⚠️ Critical Weakness
            </span>
            <span className="text-slate-200">{weakness}</span>
          </div>

          {/* Reward */}
          <div className="p-3.5 rounded-xl bg-[#07080E] border border-amber-500/30">
            <span className="text-amber-400 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
              ⚡ Defeat Bounty & Rewards
            </span>
            <span className="text-slate-200">{reward}</span>
          </div>

          {/* Recommended Action */}
          <div className="p-3.5 rounded-xl bg-[#07080E] border border-purple-500/30">
            <span className="text-purple-400 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
              🎯 Recommended Action
            </span>
            <span className="text-slate-200">{recommendedAction}</span>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-mono text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
          >
            Close Window
          </button>

          <div className="flex items-center gap-2">
            {!isDefeated && !isLocked && (
              <Link
                to="/boss-battle"
                className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                Go to Arena
              </Link>
            )}

            <button
              type="button"
              disabled={isLocked}
              onClick={() => onStartBattle(boss)}
              className={`px-5 py-2.5 rounded-xl font-bold font-rpg text-xs text-white transition-all shadow-xl ${
                isLocked
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 shadow-glow-crimson border border-red-500/40 cursor-pointer'
              }`}
            >
              {isLocked ? 'Prerequisites Locked' : isDefeated ? 'Rematch Battle' : '⚔️ Start Battle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
