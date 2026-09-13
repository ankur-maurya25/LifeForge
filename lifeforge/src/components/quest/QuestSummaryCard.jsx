import React from 'react';

export default function QuestSummaryCard({
  label,
  value,
  subtext,
  icon,
  accent = 'purple'
}) {
  const accentStyles = {
    purple: {
      border: 'border-purple-500/30 hover:border-purple-500/50',
      bgGlow: 'bg-purple-950/20',
      textAccent: 'text-purple-400',
      iconBg: 'bg-purple-900/30 text-purple-400 border-purple-500/30'
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/50',
      bgGlow: 'bg-emerald-950/20',
      textAccent: 'text-emerald-400',
      iconBg: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/50',
      bgGlow: 'bg-amber-950/20',
      textAccent: 'text-amber-400',
      iconBg: 'bg-amber-900/30 text-amber-400 border-amber-500/30'
    },
    crimson: {
      border: 'border-red-500/30 hover:border-red-500/50',
      bgGlow: 'bg-red-950/20',
      textAccent: 'text-red-400',
      iconBg: 'bg-red-900/30 text-red-400 border-red-500/30'
    },
    blue: {
      border: 'border-cyan-500/30 hover:border-cyan-500/50',
      bgGlow: 'bg-cyan-950/20',
      textAccent: 'text-cyan-400',
      iconBg: 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30'
    }
  };

  const style = accentStyles[accent] || accentStyles.purple;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-[#0E111A] border transition-all duration-300 shadow-xl ${style.border} ${style.bgGlow}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold block">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-rpg text-white tracking-tight">
            {value}
          </div>
        </div>

        {icon && (
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg border shrink-0 ${style.iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      {subtext && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span className={`w-1.5 h-1.5 rounded-full ${style.textAccent} bg-current`} />
          <span className="truncate">{subtext}</span>
        </div>
      )}
    </div>
  );
}
