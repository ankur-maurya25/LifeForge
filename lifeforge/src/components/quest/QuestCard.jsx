import React from 'react';

export default function QuestCard({
  quest,
  onComplete,
  onEdit,
  onDelete
}) {
  const id = quest._id || quest.id;
  const title = quest.title;
  const description = quest.description;
  const category = quest.category || quest.goalId?.category || 'General';
  const difficulty = quest.difficulty || 'Medium';
  const xp = quest.xpReward !== undefined ? quest.xpReward : (quest.xp || 40);
  const damage = quest.damage || Math.round(xp / 5);
  const deadline = quest.dueDate ? new Date(quest.dueDate).toISOString().split('T')[0] : (quest.deadline || '');
  const status = quest.status || 'pending';
  const progress = status === 'completed' ? 100 : (quest.progress || 0);
  const relatedGoal = quest.goalId?.title || quest.relatedGoal || '';

  const isCompleted = status === 'completed';

  // Category Color Badges
  const categoryStyles = {
    Coding: 'bg-cyan-950/50 text-cyan-300 border-cyan-500/30',
    Study: 'bg-purple-950/50 text-purple-300 border-purple-500/30',
    Fitness: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30',
    'Personal Growth': 'bg-rose-950/50 text-rose-300 border-rose-500/30',
    Career: 'bg-amber-950/50 text-amber-300 border-amber-500/30'
  };

  // Difficulty Badges
  const difficultyStyles = {
    Easy: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
    Medium: 'text-amber-400 border-amber-500/30 bg-amber-950/30',
    Hard: 'text-orange-400 border-orange-500/30 bg-orange-950/30',
    Epic: 'text-red-400 border-red-500/30 bg-red-950/30'
  };

  // Format date display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 border shadow-xl relative overflow-hidden group ${
        isCompleted
          ? 'bg-[#091512]/60 border-emerald-500/30 hover:border-emerald-500/50'
          : status === 'in_progress'
          ? 'bg-[#0E1322] border-amber-500/30 hover:border-amber-500/50'
          : 'bg-[#0E111A] border-[#1E2538] hover:border-red-900/60'
      }`}
    >
      {/* Glow highlight based on status */}
      {isCompleted && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      )}
      {!isCompleted && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Top Meta Bar: Category, Difficulty, Status */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <span
            className={`text-xs font-mono font-medium px-2.5 py-0.5 rounded-md border ${
              categoryStyles[category] || 'bg-slate-900 text-slate-300 border-slate-700'
            }`}
          >
            {category}
          </span>

          {/* Difficulty */}
          <span
            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border ${
              difficultyStyles[difficulty] || 'text-slate-300 border-slate-700 bg-slate-900'
            }`}
          >
            {difficulty}
          </span>

          {/* Related Goal Tag */}
          {relatedGoal && (
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-flex items-center gap-1">
              <span>🎯</span>
              <span className="truncate max-w-[180px]">{relatedGoal}</span>
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div>
          {isCompleted ? (
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shadow-glow-gold/10">
              <span>✓</span> COMPLETED
            </span>
          ) : status === 'in_progress' ? (
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/40 flex items-center gap-1">
              <span>⏳</span> IN PROGRESS
            </span>
          ) : (
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700 flex items-center gap-1">
              <span>⚔️</span> READY
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-4 relative z-10">
        <h4
          className={`text-base sm:text-lg font-bold font-rpg tracking-wide transition-colors ${
            isCompleted ? 'text-slate-400 line-through' : 'text-white group-hover:text-amber-200'
          }`}
        >
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* RPG Rewards Bar (XP, Boss DMG, Deadline) */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#07080E] border border-slate-800/80 mb-4 text-xs font-mono relative z-10">
        {/* XP Reward */}
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Reward</span>
          <span className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
            <span>⚡</span> +{xp} XP
          </span>
        </div>

        {/* Boss Damage */}
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Boss Strike</span>
          <span className="font-bold text-red-400 flex items-center gap-1 mt-0.5">
            <span>🔥</span> -{damage} HP
          </span>
        </div>

        {/* Deadline */}
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Deadline</span>
          <span className="font-semibold text-slate-300 flex items-center gap-1 mt-0.5 truncate">
            <span>📅</span> {formatDate(deadline)}
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-4 relative z-10">
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1.5">
          <span>Quest Progression</span>
          <span className="font-bold text-slate-200">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                : 'bg-gradient-to-r from-red-600 via-amber-500 to-amber-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Controls: Complete, Edit, Delete */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 relative z-10">
        {/* Edit & Delete Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(quest)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Edit quest details"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(quest)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-red-400/80 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Abandon quest"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Abandon</span>
          </button>
        </div>

        {/* Complete Action Button */}
        <div>
          {isCompleted ? (
            <button
              disabled
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-1.5 cursor-not-allowed opacity-90 select-none"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Quest Completed</span>
            </button>
          ) : (
            <button
              onClick={() => onComplete(id)}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-emerald-400/40 flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚔️ Complete & Attack</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
