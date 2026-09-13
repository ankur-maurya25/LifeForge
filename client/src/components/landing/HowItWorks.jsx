import React from 'react';
import { Target, Scroll, Swords, Trophy, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Target,
    title: 'Forge Your Grand Ambition',
    desc: 'Enter any 30-day or long-term target, like "Master React & Node" or "Run a 10K". LifeForge computes the required combat power.',
    color: 'from-amber-500 to-amber-700',
    border: 'border-amber-500/30'
  },
  {
    step: '02',
    icon: Scroll,
    title: 'Milestones & Daily Quests',
    desc: 'Your grand goal is automatically structured into chapters and bite-sized daily quests that prevent burnout and eliminate overwhelm.',
    color: 'from-blue-500 to-indigo-600',
    border: 'border-blue-500/30'
  },
  {
    step: '03',
    icon: Swords,
    title: 'Attack The Virtual Boss',
    desc: 'Each completed daily quest deals crushing hit points to your nemesis boss. Keep streaks alive to trigger critical hits.',
    color: 'from-red-500 to-rose-700',
    border: 'border-red-500/30'
  },
  {
    step: '04',
    icon: Trophy,
    title: 'Level Up & Claim Relics',
    desc: 'Earn XP, boost attributes (Focus, Vitality, Discipline), unlock badges, and vanquish the final boss as you reach your real-world goal.',
    color: 'from-emerald-500 to-teal-700',
    border: 'border-emerald-500/30'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-rpg-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            The Gameplay Loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-rpg text-white mt-4">
            How LifeForge Converts <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Ambition Into Victory
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            No more abandoned New Year resolutions or forgotten promises. Follow the 4-phase hero's journey.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-rpg-surface border border-rpg-border rounded-2xl p-6 relative hover:border-slate-600 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Step counter badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black font-mono text-slate-700 group-hover:text-amber-500/40 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-rpg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-slate-500 group-hover:text-amber-400 transition-colors">
                  <span>Phase {idx + 1} Mastery</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
