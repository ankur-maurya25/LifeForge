import React from 'react';

export default function RewardPreview() {
  const rewards = [
    {
      label: 'Character XP',
      value: '+150 XP',
      subtext: 'Pushes Level 8 progress',
      icon: '⚡',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400'
    },
    {
      label: 'Forge Coins',
      value: '+50 Coins',
      subtext: 'Treasury currency',
      icon: '🪙',
      color: 'border-yellow-500/40 bg-yellow-950/20 text-yellow-400'
    },
    {
      label: 'Skill Progress',
      value: '+10% Focus',
      subtext: 'Deep work rating boost',
      icon: '🎯',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300'
    },
    {
      label: 'Streak Retention',
      value: '+1 Streak Day',
      subtext: 'Guarantees 7-day fire',
      icon: '🔥',
      color: 'border-red-500/40 bg-red-950/20 text-red-400'
    }
  ];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
            <span>CHALLENGE REWARDS</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
              Clear Rewards
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Claimed upon finishing all four checklist objectives today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {rewards.map((r) => (
          <div
            key={r.label}
            className={`p-4 rounded-2xl border transition-all shadow-lg flex flex-col justify-between ${r.color}`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {r.label}
              </span>
              <span className="text-lg">{r.icon}</span>
            </div>

            <div>
              <div className="text-lg sm:text-xl font-bold font-mono">
                {r.value}
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                {r.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
