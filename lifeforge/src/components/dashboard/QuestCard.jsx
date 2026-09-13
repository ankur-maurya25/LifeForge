import React from 'react';

export default function QuestCard({
  quest,
  onToggle
}) {
  const id = quest._id || quest.id;
  const title = quest.title;
  const category = quest.category || quest.goalId?.category || 'General';
  const xp = quest.xpReward !== undefined ? quest.xpReward : (quest.xp || 40);
  const difficulty = quest.difficulty || 'Medium';
  const damage = quest.damage || Math.round(xp / 5);
  const completed = quest.status === 'completed' || quest.completed === true;

  return (
    <div
      onClick={() => onToggle(id)}
      role="checkbox"
      aria-checked={completed}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle(id);
        }
      }}
      className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-4 group ${
        completed
          ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-400'
          : 'bg-[#141824] border-[#1E2538] hover:border-amber-500/40 hover:bg-[#1A2030] text-white'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Checkbox indicator */}
        <div 
          className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-all ${
            completed 
              ? 'bg-emerald-500 border-emerald-400 text-black shadow-glow-gold/20' 
              : 'border-slate-600 bg-slate-900 group-hover:border-amber-400'
          }`}
        >
          {completed && (
            <svg className="w-3.5 h-3.5 stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>

        {/* Title & Badges */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-sm font-semibold truncate ${completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
              {title}
            </span>
            {completed && (
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30">
                COMPLETED
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            {/* Category badge */}
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {category}
            </span>
            <span>•</span>
            {/* Difficulty */}
            <span className="text-purple-400">
              {difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Rewards & Damage */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border transition-colors ${
          completed
            ? 'bg-slate-800 border-slate-700 text-slate-400'
            : 'bg-red-950/50 border-red-500/40 text-red-400 group-hover:bg-red-900/60'
        }`}>
          ⚔️ -{damage} DMG
        </span>

        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
          completed
            ? 'bg-slate-800 border-slate-700 text-slate-400'
            : 'bg-amber-950/50 border-amber-500/40 text-amber-300 shadow-sm'
        }`}>
          +{xp} XP
        </span>
      </div>
    </div>
  );
}
