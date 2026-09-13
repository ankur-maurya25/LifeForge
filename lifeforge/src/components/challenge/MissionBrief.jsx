import React from 'react';

export default function MissionBrief() {
  const points = [
    {
      label: 'Main Objective',
      value: 'Execute four disciplined micro-actions to maintain daily habit momentum and strike down the Procrastination Beast.',
      icon: '🎯'
    },
    {
      label: 'Success Condition',
      value: 'Check off all four checklist tasks prior to midnight reset (11:59 PM).',
      icon: '✓'
    },
    {
      label: 'Reward Details',
      value: '+150 Character XP, +50 Coins, +10% Focus Skill rating, and +1 day active streak increment.',
      icon: '⚡'
    },
    {
      label: 'Failure Consequence',
      value: 'Streak multiplier falls back to base 1.0x and the Procrastination Beast regains 100 HP vitality.',
      icon: '⚠️'
    }
  ];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
            <span>MISSION BRIEF</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30">
              Tactical Intel
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Complete four focused tasks today to improve your consistency, earn XP, and deal damage to the daily boss.
          </p>
        </div>

        <span className="text-[11px] font-mono text-slate-500 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 hidden sm:inline-block">
          Demo Mission Specification
        </span>
      </div>

      {/* 4 Points Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {points.map((p) => (
          <div
            key={p.label}
            className="p-4 rounded-2xl bg-[#07080E] border border-slate-800/80 space-y-1.5"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
              <span>{p.icon}</span>
              <span className="uppercase tracking-wider text-slate-400 text-[10px]">
                {p.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              {p.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
