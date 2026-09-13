import React from 'react';
import { BOSS_OPTIONS } from './BossSelector';

export default function GoalSummary({
  title,
  category,
  deadline,
  difficulty,
  selectedBossId,
  onSubmit,
  onCancel,
  isSubmitting = false
}) {
  const selectedBoss = BOSS_OPTIONS.find(b => b.id === selectedBossId) || BOSS_OPTIONS[0];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 sm:p-7 shadow-xl">
      
      <div className="mb-5">
        <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
          Campaign Brief
        </span>
        <h3 className="text-xl font-bold font-rpg text-white mt-2">
          Goal Summary
        </h3>
      </div>

      {/* Summary Fields Grid */}
      <div className="space-y-3.5 mb-6 text-xs font-mono">
        
        {/* Title */}
        <div className="p-3 rounded-xl bg-[#141824] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Target Ambition</span>
          <p className="text-sm font-bold text-white font-rpg truncate">
            {title.trim() ? `“${title}”` : '“Untitled Ambition”'}
          </p>
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-[#141824] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Category</span>
            <span className="text-white font-bold">{category}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#141824] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Difficulty</span>
            <span className="text-amber-400 font-bold">{difficulty} Tier</span>
          </div>
        </div>

        {/* Selected Boss */}
        <div className="p-3 rounded-xl bg-[#141824] border border-red-900/40 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Assigned Nemesis</span>
            <span className="text-sm font-bold text-red-400 font-rpg block truncate">
              {selectedBoss.name}
            </span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 shrink-0">
            {selectedBoss.badge}
          </span>
        </div>

        {/* Deadline & Milestones */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-[#141824] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Deadline</span>
            <span className="text-white font-bold truncate">
              {deadline || 'Not Specified'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#141824] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Milestones</span>
            <span className="text-purple-400 font-bold">5 Chapters</span>
          </div>
        </div>

        {/* Starting Reward */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span className="text-slate-300 font-semibold">Starting Completion Reward:</span>
          </div>
          <span className="text-amber-400 font-black text-sm shadow-glow-gold/20">
            +100 XP
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-800 via-red-600 to-amber-600 transition-all shadow-glow-crimson border border-red-500/50 flex items-center justify-center gap-2 font-mono tracking-wider uppercase ${
            isSubmitting
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:brightness-110 active:scale-[0.98] cursor-pointer'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Forging Campaign...</span>
            </>
          ) : (
            <>
              <span>⚔️ Forge My Boss</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full py-3 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer font-mono uppercase"
        >
          Cancel
        </button>
      </div>

    </div>
  );
}
