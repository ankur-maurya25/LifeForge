import React from 'react';

export default function TaskChecklist({
  tasks,
  onToggleTask
}) {
  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
            <span>TASK CHECKLIST</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
              {tasks.filter((t) => t.completed).length} / {tasks.length} Done
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Click tasks to check them off, claim instant XP, and execute boss damage strikes
          </p>
        </div>
      </div>

      {/* Task Rows */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = task.completed;

          return (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-4 group ${
                isCompleted
                  ? 'bg-[#0A1310] border-emerald-500/40 text-slate-300'
                  : 'bg-[#07080E] border-slate-800/80 hover:border-slate-700 hover:bg-[#0C0F19] text-white'
              }`}
            >
              {/* Checkbox and Text */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                
                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 mt-0.5 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-black shadow-glow-gold/20'
                      : 'border-slate-600 bg-slate-900 group-hover:border-amber-400'
                  }`}
                >
                  {isCompleted && (
                    <svg className="w-4 h-4 stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-sm font-bold font-rpg tracking-wide ${
                        isCompleted ? 'line-through text-slate-400' : 'text-white group-hover:text-amber-200'
                      }`}
                    >
                      {task.name}
                    </h4>

                    {isCompleted && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        COMPLETED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-mono mt-0.5 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              {/* XP and Strike Badge */}
              <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400 font-bold">
                  ⚡ +{task.xp} XP
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 font-bold hidden sm:inline-block">
                  🔥 -50 HP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
