import React from 'react';

export default function SkillGrowthSection() {
  const skills = [
    {
      name: 'Coding & Architecture',
      level: 14,
      progress: 85,
      gain: '+240 XP',
      color: 'from-amber-500 to-red-500',
      tag: 'Rank S'
    },
    {
      name: 'Iron Discipline',
      level: 13,
      progress: 78,
      gain: '+190 XP',
      color: 'from-orange-500 to-amber-500',
      tag: 'Rank A+'
    },
    {
      name: 'Deep Focus & Flow',
      level: 12,
      progress: 74,
      gain: '+160 XP',
      color: 'from-blue-500 to-indigo-500',
      tag: 'Rank A'
    },
    {
      name: 'Problem Solving',
      level: 11,
      progress: 70,
      gain: '+140 XP',
      color: 'from-purple-500 to-pink-500',
      tag: 'Rank B+'
    },
    {
      name: 'Clear Communication',
      level: 9,
      progress: 60,
      gain: '+90 XP',
      color: 'from-emerald-500 to-teal-500',
      tag: 'Rank B'
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚔️</span>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide">
            Attribute & Skill Growth
          </h3>
        </div>
        <span className="text-xs text-neutral-400 font-mono">5 Tracked Stats</span>
      </div>
      <p className="text-xs text-neutral-400 mb-5">
        Progression levels leveled up through daily habit quests and boss encounter battles.
      </p>

      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">{skill.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-neutral-300">
                  Lv. {skill.level}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20">
                  {skill.tag}
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-emerald-400">{skill.gain}</span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  style={{ width: `${skill.progress}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-500`}
                />
              </div>
              <span className="text-xs font-mono text-neutral-400 w-9 text-right">{skill.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
