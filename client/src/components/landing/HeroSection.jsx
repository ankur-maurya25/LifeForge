import React from 'react';
import { Swords, Shield, Flame, ArrowRight, Trophy, Zap } from 'lucide-react';

export default function HeroSection({ onOpenAuthModal }) {
  const scrollToDemo = () => {
    const el = document.getElementById('demo-arena');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-red-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Hackathon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-semibold mb-8 shadow-glow-gold">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>LifeForge RPG • Gamified Habit & Goal Tracking</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-rpg tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Turn Deadlines Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-amber-500">
            Epic Boss Battles
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Stop struggling with boring to-do lists. Input your 30-day goal, receive daily quests, 
          deal real damage to virtual monsters, and watch your character stats skyrocket.
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => onOpenAuthModal('signup')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-gold flex items-center justify-center gap-3"
          >
            <Swords className="w-5 h-5 fill-black" />
            <span>Create Your Character</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={scrollToDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base text-slate-200 bg-slate-900/90 border border-slate-700 hover:border-amber-400/50 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Test Simulator</span>
          </button>
        </div>

        {/* Social Proof / Stats Grid */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-bold font-rpg text-amber-400">30-Day</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Goal Campaigns</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-bold font-rpg text-red-400">100%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Boss Damage Sync</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-bold font-rpg text-blue-400">3 Stats</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Focus, Vit, Disc</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-bold font-rpg text-emerald-400">Zero</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Boring Checklists</div>
          </div>
        </div>

      </div>
    </div>
  );
}
