import React from 'react';

export default function QuestAttackCard({
  quest,
  onExecuteAttack,
  isBossDefeated = false
}) {
  const { id, title, description, category, difficulty, xp, damage, completed } = quest;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
        completed
          ? 'bg-emerald-950/15 border-emerald-500/30 text-slate-400'
          : 'bg-[#0E111A] border-[#1E2538] hover:border-red-500/40 text-white shadow-lg'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            {category}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300 font-bold">
              {difficulty}
            </span>
            {completed && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold">
                ✓ EXECUTED
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h4 className={`text-base font-bold font-rpg mb-1 ${completed ? 'line-through text-slate-500' : 'text-white'}`}>
          {title}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {description}
        </p>
      </div>

      {/* Rewards & Damage Strip */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-400 font-bold">
            ⚔️ -{damage} HP DMG
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 font-bold">
            +{xp} XP
          </span>
        </div>

        {/* Attack Action Button */}
        {completed ? (
          <span className="text-[11px] font-mono text-emerald-400/80 italic select-none">
            Quest completed — demo state only
          </span>
        ) : (
          <button
            type="button"
            disabled={isBossDefeated}
            onClick={() => onExecuteAttack(id)}
            className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-red-800 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow-crimson border border-red-500/50 flex items-center gap-1.5 cursor-pointer font-mono uppercase"
          >
            <span>Complete Quest</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
