import React from 'react';
import { 
  Target, 
  Swords, 
  TrendingUp, 
  ShieldCheck, 
  History, 
  Smartphone, 
  Sparkles, 
  Award 
} from 'lucide-react';

const FEATURES = [
  {
    icon: Target,
    title: 'Goal-to-Quest Decomposition',
    desc: 'Input 30-day or 90-day targets. LifeForge decomposes them into chapter milestones and manageable daily habit quests.',
    tag: 'Core RPG'
  },
  {
    icon: Swords,
    title: 'Interactive Boss Health Engine',
    desc: 'Each daily quest inflicts damage directly onto a virtual monster. Streak multipliers grant critical damage strikes.',
    tag: 'Battle'
  },
  {
    icon: TrendingUp,
    title: '3-Attribute RPG Progression',
    desc: 'Every quest boosts your character’s core stats: Focus (deep work), Discipline (consistency), and Vitality (wellness).',
    tag: 'Character'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Full-Stack Architecture',
    desc: 'Protected by JWT authentication and bcrypt password hashing. Clean MongoDB models with server-side validation.',
    tag: 'Security'
  },
  {
    icon: History,
    title: 'Chronicle & Battle Log History',
    desc: 'Revisit every past victory, completed quest, and slayed boss with timestamps and analytical completion streaks.',
    tag: 'Analytics'
  },
  {
    icon: Smartphone,
    title: 'Responsive Cross-Device Layout',
    desc: 'Play on desktop during deep coding sprints or tick off habits on your mobile phone on the go.',
    tag: 'Responsive'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-rpg-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Hackathon Grade Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-rpg text-white">
            Engineered For Consistent Victory
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            Everything you need to stay motivated, accountable, and engaged through full-stack gamification.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-rpg-surface border border-rpg-border rounded-2xl p-6 hover:border-amber-500/30 hover:bg-slate-900/90 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 font-rpg">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
