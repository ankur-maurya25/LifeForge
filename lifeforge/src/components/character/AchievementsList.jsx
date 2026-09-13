import React from 'react';

const ACHIEVEMENTS_DATA = [
  {
    id: 'first-quest',
    name: 'First Quest Completed',
    description: 'Completed your very first productivity quest and struck the boss.',
    icon: '⚔️',
    earned: true,
    earnedDate: 'Earned Sep 02, 2026',
    reward: '+100 XP'
  },
  {
    id: '7-day-streak',
    name: '7 Day Streak',
    description: 'Maintained uninterrupted quest momentum for 7 consecutive days.',
    icon: '🔥',
    earned: true,
    earnedDate: 'Earned Sep 08, 2026',
    reward: '+250 XP'
  },
  {
    id: 'first-boss',
    name: 'First Boss Defeated',
    description: 'Conquered “The Imposter Syndrome Demon” campaign goal.',
    icon: '🏆',
    earned: true,
    earnedDate: 'Earned Sep 05, 2026',
    reward: '+500 XP'
  },
  {
    id: 'project-builder',
    name: 'Project Builder',
    description: 'Complete a full end-to-end full-stack portfolio deployment.',
    icon: '🏗️',
    earned: false,
    requirement: '4/10 Milestones Cleared',
    reward: '+1,000 XP'
  },
  {
    id: 'consistency-master',
    name: 'Consistency Master',
    description: 'Maintain a 30-day streak without breaking daily productivity habits.',
    icon: '👑',
    earned: false,
    requirement: '6/30 Days Streak Completed',
    reward: '+1,500 XP'
  }
];

export default function AchievementsList({ achievements = ACHIEVEMENTS_DATA }) {
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
            <span>ACHIEVEMENTS & TROPHIES</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
              {earnedCount} / {achievements.length} Unlocked
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Legendary trophies earned throughout your Goal-to-Boss conquests
          </p>
        </div>
        <a
          href="/achievements"
          className="px-3 py-1 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-xs font-mono text-amber-300 hover:text-white transition-all flex items-center gap-1.5"
        >
          <span>🏆</span>
          <span>Hall of Feats →</span>
        </a>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden group ${
              item.earned
                ? 'bg-[#0F141C] border-amber-500/40 hover:border-amber-400/60 shadow-glow-gold/10'
                : 'bg-[#090B10] border-slate-800/80 opacity-70 hover:opacity-85'
            }`}
          >
            {/* Ambient Gold glow on earned */}
            {item.earned && (
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            )}

            <div>
              {/* Header: Icon & Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${
                    item.earned
                      ? 'bg-amber-950/50 border-amber-500/40 text-amber-300 shadow-glow-gold/20'
                      : 'bg-slate-900 border-slate-800 text-slate-500 grayscale'
                  }`}
                >
                  {item.icon}
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    item.earned
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {item.earned ? '✓ UNLOCKED' : 'LOCKED'}
                </span>
              </div>

              {/* Title & Description */}
              <h4
                className={`text-sm font-bold font-rpg mb-1 ${
                  item.earned ? 'text-white group-hover:text-amber-200' : 'text-slate-400'
                }`}
              >
                {item.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            {/* Footer: Date or Requirement */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
              <span className={item.earned ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                {item.earned ? item.earnedDate : item.requirement}
              </span>
              <span className="text-amber-400 font-bold">{item.reward}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
