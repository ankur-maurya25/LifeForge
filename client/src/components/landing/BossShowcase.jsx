import React, { useState } from 'react';
import { Skull, Shield, Flame, Zap, Award, Swords, ChevronRight } from 'lucide-react';

const BOSS_DATA = [
  {
    id: 'procrastination',
    name: 'Malakor The Sloth Lord',
    title: 'Nemesis of High Ambitions',
    level: 10,
    hp: '1,500 HP',
    weakness: 'Deep Focus Sprints (Pomodoro)',
    lore: 'Preys on students and developers who whisper "I will start tomorrow." Grows stronger with every notification checked.',
    dropReward: 'Crown of Relentless Focus (+30 Discipline)',
    badgeColor: 'border-red-500/50 bg-red-950/40 text-red-400',
    element: 'Shadow & Dread'
  },
  {
    id: 'burnout',
    name: 'Ignis The Overwork Drake',
    title: 'The Blazing Flame of Exhaustion',
    level: 18,
    hp: '2,800 HP',
    weakness: 'Restorative Sleep & Hydration Quests',
    lore: 'Born when ambitious achievers code 18 hours without eating or resting. Can only be countered through balanced stamina.',
    dropReward: 'Amulet of Eternal Vitality (+25 Vitality)',
    badgeColor: 'border-amber-500/50 bg-amber-950/40 text-amber-400',
    element: 'Infernal Heat'
  },
  {
    id: 'distraction',
    name: 'Seraphina The Algorithmic Siren',
    title: 'Queen of Endless Feeds',
    level: 25,
    hp: '4,000 HP',
    weakness: 'App Blockers & Offline Study Blocks',
    lore: 'Shapes herself into endless short-form videos and chat groups, trapping adventurers inside infinite scrolling spirals.',
    dropReward: 'Band of Iron Will (+40 Focus, +20 Speed)',
    badgeColor: 'border-purple-500/50 bg-purple-950/40 text-purple-400',
    element: 'Illusion & Chaos'
  }
];

export default function BossShowcase({ onSelectBoss }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeBoss = BOSS_DATA[activeIdx];

  return (
    <section id="boss-vault" className="py-24 bg-rpg-surface/60 border-y border-rpg-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Skull className="w-3.5 h-3.5" />
            Boss Bestiary
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-rpg text-white">
            Meet Your Formidable Foes
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            Every goal spawns a bespoke boss tailored to the psychological barriers you face in real life.
          </p>
        </div>

        {/* Boss Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {BOSS_DATA.map((boss, idx) => (
            <button
              key={boss.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
                activeIdx === idx
                  ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-glow-gold'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
              }`}
            >
              <Skull className={`w-4 h-4 ${activeIdx === idx ? 'text-black' : 'text-amber-500'}`} />
              <span>{boss.name.split(' ')[0]}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${activeIdx === idx ? 'bg-black/20 text-black' : 'bg-slate-800 text-slate-400'}`}>
                Lv.{boss.level}
              </span>
            </button>
          ))}
        </div>

        {/* Featured Boss Card Display */}
        <div className="max-w-4xl mx-auto bg-rpg-card border border-rpg-border rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Visual Emblem */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-slate-800 text-center">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-red-900/30 to-amber-900/30 border-2 border-red-500/30 flex items-center justify-center shadow-glow-crimson mb-4">
                <Skull className="w-14 h-14 text-red-500 animate-pulse" />
              </div>
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest">
                Tier: Cataclysm
              </span>
              <div className="mt-2 text-2xl font-black font-rpg text-white">
                {activeBoss.hp}
              </div>
              <span className="text-[11px] text-slate-500">Base Boss Stamina</span>
            </div>

            {/* Right Column: Details & Weakness */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
                  Boss Level {activeBoss.level} • {activeBoss.element}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-rpg text-white mt-1">
                  {activeBoss.name}
                </h3>
                <p className="text-sm text-slate-400 italic mt-0.5">
                  "{activeBoss.title}"
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                {activeBoss.lore}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Fatal Vulnerability</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {activeBoss.weakness}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Defeat Bounty</div>
                  <div className="text-xs font-semibold text-amber-400 mt-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {activeBoss.dropReward}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectBoss(activeBoss.name)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-sm shadow-glow-crimson transition-all flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  <span>Challenge {activeBoss.name.split(' ')[0]} in Step 2</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
