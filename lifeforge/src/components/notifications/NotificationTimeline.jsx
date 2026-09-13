import React from 'react';

const TIMELINE_DATA = [
  {
    id: 1,
    icon: '⚔️',
    title: 'Completed Morning Study Quest',
    description: 'Finished 25 minutes of dynamic programming review with zero distraction breaks.',
    time: 'Today, 10:45 AM',
    badge: '+40 XP',
    badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
  },
  {
    id: 2,
    icon: '⚡',
    title: 'Earned +50 XP Bonus',
    description: 'Achieved daily momentum habit milestone. Character level progress pushed to 64%.',
    time: 'Today, 08:30 AM',
    badge: 'Bonus XP',
    badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30'
  },
  {
    id: 3,
    icon: '✨',
    title: 'Unlocked Deep Work Perk',
    description: 'Enables 90-minute uninterrupted sprints with +20% focus attribute gain.',
    time: 'Yesterday',
    badge: 'Perk Active',
    badgeColor: 'text-purple-400 bg-purple-950/40 border-purple-500/30'
  },
  {
    id: 4,
    icon: '🐉',
    title: 'Defeated Distraction Boss',
    description: 'Struck down The Notification Hydra in Sprint 2 with 3 consecutive quest completions.',
    time: '2 days ago',
    badge: 'Boss Victory',
    badgeColor: 'text-red-400 bg-red-950/40 border-red-500/30'
  }
];

export default function NotificationTimeline({ activities = TIMELINE_DATA }) {
  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
            <span>RECENT ACTIVITY</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              Combat Ledger
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Chronological audit of productivity milestones and battle impacts
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {activities.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-[#0E111A] border border-slate-700 group-hover:border-purple-400 flex items-center justify-center text-xs transition-colors shadow-md">
              {item.icon}
            </div>

            {/* Box */}
            <div className="bg-[#07080E] border border-slate-800/80 group-hover:border-slate-700 rounded-xl p-3.5 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h4 className="text-xs sm:text-sm font-bold font-rpg text-white group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {item.time}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
