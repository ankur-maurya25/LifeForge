import React from 'react';

export default function BossDamagePreview({
  bossName = 'Procrastination Beast',
  maxHp = 600,
  damagePerTask = 50,
  completedTasksCount = 2,
  totalTasksCount = 4
}) {
  const currentDamage = completedTasksCount * damagePerTask;
  const currentHp = Math.max(0, maxHp - currentDamage);
  const hpPercentage = Math.round((currentHp / maxHp) * 100);
  const totalPossibleDamage = totalTasksCount * damagePerTask;

  return (
    <div className="bg-[#0E111A] border border-red-900/40 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Ambient Crimson Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-red-400 uppercase">
                TARGET BOSS VITALITY
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-rpg text-white">
              {bossName}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-red-400">
              🔥 -{currentDamage} HP Dealt
            </span>
            <span className="text-[10px] font-mono text-slate-400 block">
              Max possible: -{totalPossibleDamage} HP
            </span>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 font-semibold">
              Boss HP: {currentHp} / {maxHp}
            </span>
            <span className="text-amber-400 font-bold">
              {hpPercentage}% Vitality
            </span>
          </div>

          <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-red-700 via-red-500 to-amber-500 shadow-glow-crimson"
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        {/* Mini stats preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#07080E] border border-red-900/30 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Strike Rate</span>
            <span className="font-bold text-slate-200">-{damagePerTask} HP / Task</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Total Striking</span>
            <span className="font-bold text-amber-400">{completedTasksCount} Strikes Dealt</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 uppercase block">Status</span>
            <span className={currentHp === 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {currentHp === 0 ? 'Conquered!' : 'Under Assault'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
