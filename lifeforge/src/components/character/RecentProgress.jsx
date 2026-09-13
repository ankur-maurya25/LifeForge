import React from 'react';

const PROGRESS_TIMELINE = [
  {
    id: 'prog-1',
    type: 'quest',
    icon: '⚔️',
    title: 'Completed Daily Quest: “Complete frontend UI”',
    description: 'Delivered responsive views and components. Struck active boss for -10 HP.',
    time: 'Today, 10:45 AM',
    badge: '+50 XP',
    badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30'
  },
  {
    id: 'prog-2',
    type: 'xp',
    icon: '⚡',
    title: 'Earned XP & Stat Surge',
    description: 'Problem Solving attribute increased to 78 following DSA tree problem completion.',
    time: 'Today, 08:30 AM',
    badge: '+40 XP',
    badgeColor: 'text-purple-400 bg-purple-950/40 border-purple-500/30'
  },
  {
    id: 'prog-3',
    type: 'skill',
    icon: '✨',
    title: 'Advanced Skill: “Consistency” Mastered',
    description: 'Unlocked Tier 1 streak multiplier. Procrastination boss damage increased by 1.5x.',
    time: 'Yesterday',
    badge: 'Skill Mastered',
    badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
  },
  {
    id: 'prog-4',
    type: 'boss',
    icon: '🐉',
    title: 'Defeated Mini Boss: “The Distraction Goblin”',
    description: 'Successfully cleared 3 focused deep work sprints without social media interruption.',
    time: '2 days ago',
    badge: 'Boss Defeated',
    badgeColor: 'text-red-400 bg-red-950/40 border-red-500/30'
  },
  {
    id: 'prog-5',
    type: 'level',
    icon: '📈',
    title: 'Coding Attribute Reached “Advanced” Tier',
    description: 'Surpassed 80 skill rating in syntax proficiency and full-stack architecture.',
    time: '3 days ago',
    badge: 'Tier Upgrade',
    badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30'
  }
];

export default function RecentProgress({ timeline = PROGRESS_TIMELINE }) {
  return (
    <div className="rounded-2xl p-6 bg-[#0E111A] border border-[#1E2538] shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
            <span>RECENT HEROIC PROGRESS</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              Timeline
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Log of completed quests, attribute surges, and campaign milestones
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-[#0E111A] border border-slate-700 group-hover:border-amber-400 flex items-center justify-center text-xs transition-colors shadow-md">
              {item.icon}
            </div>

            {/* Content Box */}
            <div className="bg-[#07080E] border border-slate-800/80 group-hover:border-slate-700 rounded-xl p-3.5 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h4 className="text-xs sm:text-sm font-bold font-rpg text-white group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}
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
