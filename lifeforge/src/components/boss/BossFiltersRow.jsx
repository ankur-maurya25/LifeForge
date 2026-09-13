import React from 'react';

export default function BossFiltersRow({
  statusFilter,
  onStatusChange,
  difficultyFilter,
  onDifficultyChange,
  statusCounts = { All: 6, Active: 2, Defeated: 3, Locked: 1 }
}) {
  const statuses = ['All', 'Active', 'Defeated', 'Locked'];
  const difficulties = ['All Difficulties', 'Easy', 'Medium', 'Hard', 'Epic'];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {statuses.map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold shadow-glow-crimson'
                  : 'bg-[#080A10] border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/40 text-amber-300' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {statusCounts[status] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Difficulty Dropdown */}
      <div className="flex items-center gap-2 self-start md:self-auto">
        <span className="text-xs font-mono text-slate-400">Difficulty:</span>
        <select
          value={difficultyFilter}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-[#080A10] border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500/50 cursor-pointer"
        >
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
