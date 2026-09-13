import React from 'react';

export default function QuestCompletionSection({
  completed = 0,
  pending = 0,
  total = 0,
  rate = 0,
  difficultyBreakdown = null
}) {
  const actualTotal = total || (completed + pending);
  const completedPct = actualTotal > 0 ? Math.round((completed / actualTotal) * 100) : 0;
  const pendingPct = actualTotal > 0 ? Math.round((pending / actualTotal) * 100) : 0;

  const breakdown = [
    {
      label: 'Completed Quests',
      count: completed,
      pct: completedPct,
      color: 'bg-emerald-500',
      text: 'text-emerald-400'
    },
    {
      label: 'Active / In Progress',
      count: pending,
      pct: pendingPct,
      color: 'bg-amber-500',
      text: 'text-amber-400'
    }
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">
              Quest Clearance Ratio
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            {rate}% Efficiency
          </span>
        </div>

        <p className="text-xs text-neutral-400 mb-5 font-mono">
          Breakdown of total quests accepted during tracking cycle ({actualTotal} total assigned quests).
        </p>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-3.5 rounded-full bg-white/5 overflow-hidden flex p-0.5 border border-white/10 mb-6">
          <div
            style={{ width: `${completedPct}%` }}
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full transition-all duration-500"
            title={`Completed: ${completed}`}
          />
          <div
            style={{ width: `${pendingPct}%` }}
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-r-full transition-all duration-500"
            title={`In Progress: ${pending}`}
          />
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs font-medium text-neutral-300">{item.label}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-white font-bold">{item.count}</span>
                <span className={`text-[11px] ${item.text}`}>({item.pct}%)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Difficulty Breakdown if provided */}
        {difficultyBreakdown && (
          <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Difficulty Mastery
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['Easy', 'Medium', 'Hard'].map((diff) => {
                const item = difficultyBreakdown[diff] || { completed: 0, total: 0 };
                return (
                  <div key={diff} className="p-2 rounded-lg bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">{diff}</span>
                    <span className="text-xs font-bold text-white font-mono mt-0.5 block">
                      {item.completed}/{item.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-neutral-400 flex items-center justify-between font-mono">
        <span>Completion streak modifier:</span>
        <span className="text-amber-400 font-semibold">{rate >= 70 ? '+15% Bonus XP' : '+0% Standard'}</span>
      </div>
    </div>
  );
}
