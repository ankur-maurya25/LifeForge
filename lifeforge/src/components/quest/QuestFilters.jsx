import React from 'react';

export default function QuestFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  statusCounts = { all: 0, pending: 0, in_progress: 0, completed: 0 }
}) {
  const categories = [
    'All',
    'Coding',
    'Study',
    'Fitness',
    'Personal Growth',
    'Career'
  ];

  const statuses = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'pending', label: 'Pending', count: statusCounts.pending },
    { key: 'in_progress', label: 'In Progress', count: statusCounts.in_progress },
    { key: 'completed', label: 'Completed', count: statusCounts.completed }
  ];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Top Row: Search Input & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search quests by title, skill, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080A10] border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition-all font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#080A10] border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500/50 cursor-pointer"
          >
            <option value="newest">⚡ Newest First</option>
            <option value="xp">🔥 Highest XP Reward</option>
            <option value="difficulty">⚔️ Difficulty (Hard to Easy)</option>
            <option value="deadline">⏳ Deadline (Closest First)</option>
          </select>
        </div>
      </div>

      {/* Middle Row: Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {statuses.map(({ key, label, count }) => {
            const isActive = selectedStatus === key;
            return (
              <button
                key={key}
                onClick={() => onStatusChange(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-glow-crimson font-bold'
                    : 'bg-[#141824] text-slate-400 hover:text-slate-200 hover:bg-[#1A2030] border border-slate-800'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-black/40 text-amber-300'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 underline transition-colors cursor-pointer"
          >
            <span>Reset filters</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Row: Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
        <span className="text-[11px] font-mono text-slate-400 shrink-0 uppercase tracking-wider">
          Category:
        </span>
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => {
            const isActive =
              (cat === 'All' && selectedCategory === 'all') ||
              selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === 'All' ? 'all' : cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-purple-900/40 text-purple-200 border border-purple-500/50 font-semibold'
                    : 'bg-[#080A10] text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
