import React from 'react';

const ACTIVITIES = [
  {
    id: 1,
    title: 'Completed Daily Quest',
    detail: 'Build Auth & JWT routes (-40 HP damage to Malakor)',
    time: '25m ago',
    icon: '⚔️',
    badge: '+50 XP',
    badgeStyle: 'text-amber-400 bg-amber-950/40 border-amber-500/30'
  },
  {
    id: 2,
    title: 'Earned Combat Experience',
    detail: 'Completed 2 consecutive Pomodoro sprints',
    time: '2h ago',
    icon: '⚡',
    badge: '+80 XP',
    badgeStyle: 'text-blue-400 bg-blue-950/40 border-blue-500/30'
  },
  {
    id: 3,
    title: 'Skill Level Upgraded',
    detail: 'Focus stat increased from Lv. 13 to Lv. 14',
    time: 'Yesterday',
    icon: '📈',
    badge: 'Skill Up',
    badgeStyle: 'text-purple-400 bg-purple-950/40 border-purple-500/30'
  },
  {
    id: 4,
    title: 'Reached New Hero Tier',
    detail: 'Achieved LEVEL 08: Rising Builder rank',
    time: '2 days ago',
    icon: '🏆',
    badge: 'Level 08',
    badgeStyle: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
  }
];

export default function ActivityList() {
  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold font-rpg text-white">
            RECENT ACTIVITY
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Chronicle of your victories and progress
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500">Live Feed</span>
      </div>

      <div className="space-y-3.5">
        {ACTIVITIES.map((act) => (
          <div
            key={act.id}
            className="p-3 rounded-xl bg-[#141824] border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
          >
            <span className="text-base p-1.5 rounded-lg bg-slate-900 shrink-0 border border-slate-800">
              {act.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white truncate">
                  {act.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {act.time}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {act.detail}
              </p>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${act.badgeStyle}`}>
              {act.badge}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
