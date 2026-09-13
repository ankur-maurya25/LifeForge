import React from 'react';

export default function BossesTab({ bosses = [], onEditBoss, onDeleteBoss }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>🐉</span>
            <span>Boss Roster & Dungeon Threats ({bosses.length})</span>
          </h3>
          <p className="text-xs text-neutral-400">Manage real-life goal bosses, max hit points, and battle status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {bosses.map((boss) => (
          <div
            key={boss.id}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-300 border border-red-500/30 uppercase">
                  {boss.difficulty}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    boss.status === 'Active' || boss.status === 'Undefeated'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-neutral-800 text-neutral-400 border border-white/5'
                  }`}
                >
                  {boss.status}
                </span>
              </div>

              <div className="flex items-center gap-2.5 my-1">
                <span className="text-xl">{boss.icon || '🐲'}</span>
                <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                  {boss.name}
                </h4>
              </div>

              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                {boss.description || 'A fearsome embodiment of procrastination and creative stagnation.'}
              </p>

              {/* Boss HP Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                  <span>Boss Health</span>
                  <span className="text-red-400 font-bold">{boss.hp} HP</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
              <button
                onClick={() => onEditBoss(boss)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteBoss(boss.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
