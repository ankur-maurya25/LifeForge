import React from 'react';

export default function QuestsTab({ quests = [], onEditQuest, onDeleteQuest }) {
  const getDifficultyBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
      case 'rank d':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'medium':
      case 'rank c':
      case 'rank b':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'hard':
      case 'rank a':
      case 'legendary':
      case 'rank s':
        return 'bg-red-500/10 text-red-300 border-red-500/20';
      default:
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>⚔️</span>
            <span>Active Quests Registry ({quests.length})</span>
          </h3>
          <p className="text-xs text-neutral-400">Configure daily habit quests, XP yields, and clearance parameters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${getDifficultyBadge(quest.difficulty)}`}>
                  {quest.difficulty}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    quest.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-neutral-800 text-neutral-400 border border-white/5'
                  }`}
                >
                  {quest.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {quest.name}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                {quest.description || 'Complete daily objectives to weaken the Procrastination Titan.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400">
                +{quest.xp} XP
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditQuest(quest)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteQuest(quest.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
