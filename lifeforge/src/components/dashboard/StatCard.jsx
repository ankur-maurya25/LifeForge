import React from 'react';

export default function StatCard({
  label,
  value,
  subtitle,
  icon,
  accent = 'amber'
}) {
  const accentStyles = {
    amber: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
    red: 'border-red-500/30 text-red-400 bg-red-950/20',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-950/20',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
  };

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] hover:border-slate-700 rounded-2xl p-5 shadow-lg flex items-center gap-4 transition-all">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${accentStyles[accent] || accentStyles.amber}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          {label}
        </span>
        <div className="text-2xl font-black font-rpg text-white mt-0.5 truncate">
          {value}
        </div>
        {subtitle && (
          <span className="text-[10px] font-mono text-slate-500 block truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
