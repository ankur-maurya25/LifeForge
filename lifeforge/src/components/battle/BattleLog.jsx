import React from 'react';

export default function BattleLog({ logs = [] }) {
  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold font-rpg text-white">
            BATTLE LOG
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            Chronicle of active combat strikes
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30 text-red-400 font-bold">
          Live Combat Sync
        </span>
      </div>

      {/* Log Feed */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-2.5 rounded-xl bg-[#141824] border border-slate-800/80 flex items-start gap-2.5 text-xs font-mono"
          >
            <span className="text-sm mt-0.5">{log.icon || '⚔️'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`font-semibold truncate ${log.color || 'text-slate-200'}`}>
                  {log.message}
                </span>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {log.time}
                </span>
              </div>
              {log.subtext && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {log.subtext}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
