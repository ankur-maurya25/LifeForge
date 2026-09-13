import React from 'react';

const STATS_DATA = [
  {
    id: 'coding',
    name: 'Coding',
    score: 85,
    maxScore: 100,
    tier: 'Advanced',
    tierColor: 'text-cyan-300 bg-cyan-950/50 border-cyan-500/40',
    barGradient: 'from-blue-600 via-cyan-500 to-teal-400',
    icon: '💻',
    description: 'React, component logic, clean architecture & syntax mastery'
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    score: 78,
    maxScore: 100,
    tier: 'Advanced',
    tierColor: 'text-purple-300 bg-purple-950/50 border-purple-500/40',
    barGradient: 'from-purple-600 via-purple-500 to-indigo-400',
    icon: '🧩',
    description: 'Data structures, algorithm efficiency & root cause analysis'
  },
  {
    id: 'discipline',
    name: 'Discipline',
    score: 72,
    maxScore: 100,
    tier: 'Intermediate',
    tierColor: 'text-amber-300 bg-amber-950/50 border-amber-500/40',
    barGradient: 'from-amber-600 via-yellow-500 to-amber-400',
    icon: '🛡️',
    description: 'Habit adherence, daily quest consistency & overcoming resistance'
  },
  {
    id: 'focus',
    name: 'Focus',
    score: 68,
    maxScore: 100,
    tier: 'Intermediate',
    tierColor: 'text-rose-300 bg-rose-950/50 border-rose-500/40',
    barGradient: 'from-red-600 via-rose-500 to-pink-500',
    icon: '🎯',
    description: 'Deep work blocks, zero context switching & distraction shielding'
  },
  {
    id: 'communication',
    name: 'Communication',
    score: 60,
    maxScore: 100,
    tier: 'Intermediate',
    tierColor: 'text-emerald-300 bg-emerald-950/50 border-emerald-500/40',
    barGradient: 'from-emerald-600 via-teal-500 to-emerald-400',
    icon: '💬',
    description: 'Documentation, peer code reviews & clear system explanations'
  }
];

export default function CharacterStats({ stats = STATS_DATA }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
            <span>CHARACTER ATTRIBUTES</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30">
              5 Core Attributes
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Core stats level up through completed quest types
          </p>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
          Demo Data Matrix
        </span>
      </div>

      {/* Responsive Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-2xl p-4 sm:p-5 bg-[#0E111A] border border-[#1E2538] hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Header: Icon & Tier */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${stat.tierColor}`}
                >
                  {stat.tier}
                </span>
              </div>

              {/* Name & Score */}
              <div className="mb-2">
                <h4 className="text-sm font-bold font-rpg text-white group-hover:text-amber-200 transition-colors">
                  {stat.name}
                </h4>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-white">
                    {stat.score}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    / {stat.maxScore}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-400 font-mono line-clamp-2 leading-relaxed mb-3">
                {stat.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.barGradient} transition-all duration-500`}
                  style={{ width: `${(stat.score / stat.maxScore) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
