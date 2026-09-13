import React from 'react';

export default function AchievementsTab({ achievements = [], onToggleAchievement }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>🏆</span>
            <span>Achievement Catalog ({achievements.length})</span>
          </h3>
          <p className="text-xs text-neutral-400">Unlockable milestones rewarded to dedicated adventurers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {achievements.map((item) => {
          const isActive = item.status === 'Active';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-white/[0.02] border-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                  : 'bg-white/[0.01] border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-xl shadow-sm">
                    {item.icon || '🏅'}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-400 border border-white/5'
                    }`}
                  >
                    {isActive ? 'Active' : 'Locked'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-1">
                  {item.name}
                </h4>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">
                  +{item.xp} XP
                </span>

                <button
                  onClick={() => onToggleAchievement(item.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
                  }`}
                >
                  {isActive ? 'Lock' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
