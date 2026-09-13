import React from 'react';

export default function BossHealthBar({
  currentHp = 720,
  maxHp = 1000,
  initialHp = 720
}) {
  const hpPercentage = Math.max(0, Math.round((currentHp / maxHp) * 100));
  const initialPercentage = Math.round((initialHp / maxHp) * 100);

  return (
    <div className="w-full space-y-3">
      {/* Top Labels: Status & Values */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono font-bold gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 uppercase tracking-wider">
            BOSS HEALTH METER
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            {currentHp} / {maxHp} HP
          </span>
          <span className="px-2 py-0.5 rounded bg-red-950/70 border border-red-500/40 text-red-300">
            {hpPercentage}% HP REMAINING
          </span>
        </div>
      </div>

      {/* Primary Health Bar */}
      <div className="h-5 w-full bg-black/90 rounded-full overflow-hidden p-1 border border-red-900/60 relative shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 shadow-glow-crimson ${
            hpPercentage > 50
              ? 'bg-gradient-to-r from-red-700 via-red-500 to-amber-500'
              : hpPercentage > 20
              ? 'bg-gradient-to-r from-red-800 via-red-600 to-red-500'
              : 'bg-red-600 animate-pulse'
          }`}
          style={{ width: `${hpPercentage}%` }}
        />
      </div>

      {/* Visual Progress Comparison Banner */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono p-2 rounded-lg bg-slate-950/80 border border-slate-800">
        <span className="text-slate-400">
          Encounter Progress:
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 line-through">Start: {initialPercentage}% HP</span>
          <span className="text-amber-400 font-bold">→</span>
          <span className="text-emerald-400 font-bold">Current: {hpPercentage}% HP</span>
          {initialPercentage > hpPercentage && (
            <span className="text-red-400 font-bold">
              (-{initialPercentage - hpPercentage}% DMG Sustained)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
