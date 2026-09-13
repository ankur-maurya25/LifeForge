import React from 'react';
import { Link } from 'react-router-dom';

export default function GoalAnalyticsSection({
  totalGoals = 0,
  activeGoals = 0,
  completedGoals = 0,
  pausedGoals = 0,
  completionPercentage = 0,
  categories = [],
  recentGoals = []
}) {
  const categoryColors = [
    'from-amber-500 to-red-500',
    'from-blue-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-amber-500'
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide">
            Goal & Category Analytics
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
          {completionPercentage}% Mastery Rate
        </span>
      </div>

      {/* Goal Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <span className="text-slate-400 block text-[10px]">Total Goals</span>
          <span className="text-base font-bold text-white mt-1 block">{totalGoals}</span>
        </div>
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <span className="text-slate-400 block text-[10px]">Active Campaigns</span>
          <span className="text-base font-bold text-purple-300 mt-1 block">{activeGoals}</span>
        </div>
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <span className="text-slate-400 block text-[10px]">Conquered / Completed</span>
          <span className="text-base font-bold text-emerald-400 mt-1 block">{completedGoals}</span>
        </div>
        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
          <span className="text-slate-400 block text-[10px]">Paused Campaigns</span>
          <span className="text-base font-bold text-neutral-400 mt-1 block">{pausedGoals}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">
          Category Distribution
        </h4>

        {categories.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-slate-400">
            No category metrics yet. Create a goal to begin tracking!
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat, idx) => {
              const color = categoryColors[idx % categoryColors.length];
              return (
                <div
                  key={cat.category}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white font-mono">{cat.category}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {cat.completed}/{cat.count} Cleared • Avg {cat.avgProgress}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, Math.max(0, cat.avgProgress))}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Goals Quick List */}
      {recentGoals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
              Recent Campaigns
            </h4>
            <Link to="/dashboard" className="text-[11px] font-mono text-amber-400 hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-2">
            {recentGoals.map((g) => (
              <div
                key={g._id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs"
              >
                <div className="truncate mr-2">
                  <span className="font-medium text-white block truncate">{g.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {g.category} • {g.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-amber-400 font-bold">{g.progress || 0}%</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                      g.status === 'completed'
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {g.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
