import React from 'react';

const FEATURES = [
  {
    title: 'Goal-to-Boss Engine',
    description: 'Turn 30-day or 90-day targets into a living virtual boss. Every goal receives a calculated health pool and milestone armor tiers.',
    accent: 'border-red-500/30 text-red-400',
    icon: (
      <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  },
  {
    title: 'XP and Leveling',
    description: 'Every completed daily quest rewards experience points. Level up your hero rank from Novice to Grandmaster as you stay consistent.',
    accent: 'border-amber-500/30 text-amber-400',
    icon: (
      <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    )
  },
  {
    title: 'Skill Progression',
    description: 'Cultivate tangible real-life attributes: Focus (deep work blocks), Discipline (unbroken streaks), and Vitality (wellness & stamina).',
    accent: 'border-purple-500/30 text-purple-400',
    icon: (
      <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    )
  },
  {
    title: 'Streaks and Rewards',
    description: 'Multipliers boost critical damage strikes against bosses when you maintain multi-day streaks. Unlock exclusive achievements.',
    accent: 'border-emerald-500/30 text-emerald-400',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    )
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-[#080A10] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3.5 py-1 rounded-full border border-purple-500/20">
            Engineered For Consistent Progress
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-rpg text-white mt-4">
            Core Features
          </h2>
          <p className="mt-3 text-slate-400 text-base max-w-xl mx-auto">
            Everything designed to replace willpower fatigue with rewarding game loops.
          </p>
        </div>

        {/* 4 Features 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-7 hover:border-slate-600 hover:bg-[#131722] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#141824] border border-slate-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-rpg">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
