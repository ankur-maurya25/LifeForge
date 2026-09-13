import React from 'react';

export default function LeaderboardFilters({
  category = 'xp',
  onCategoryChange,
  onRefresh,
  loading = false
}) {
  const categories = [
    { id: 'xp', label: 'Overall XP', icon: '⚡' },
    { id: 'level', label: 'Hunter Level', icon: '⭐' },
    { id: 'quests', label: 'Completed Quests', icon: '✓' },
    { id: 'streak', label: 'Current Streak', icon: '🔥' }
  ];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider hidden lg:inline-block">
          Rank By:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
          {categories.map((cat) => {
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold shadow-glow-crimson'
                    : 'bg-[#080A10] border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Controls: Refresh */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Fetch latest rankings"
        >
          <span className={`inline-block ${loading ? 'animate-spin' : ''}`}>↻</span>
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

    </div>
  );
}
