import React from 'react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#07080D] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141824] border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-glow-gold/30">
            <span>⚔️ The Goal-to-Boss Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-rpg tracking-wide text-white drop-shadow-sm">
            FROM GOAL TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-500">VICTORY</span>
          </h2>

          <p className="mt-4 text-slate-300 text-base sm:text-lg font-normal">
            Every big goal becomes a playable journey.
          </p>
        </div>

        {/* 3-Step Connected Process Layout */}
        <div className="relative">
          
          {/* Connecting Line between cards on Desktop (Horizontal Flow) */}
          <div className="hidden lg:block absolute top-1/2 left-[18%] right-[18%] -translate-y-1/2 h-[2px] bg-gradient-to-r from-amber-500/40 via-purple-500/40 to-red-500/40 -z-0 pointer-events-none" />

          {/* Grid Container for 3 Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            
            {/* ================= STEP 1: CREATE YOUR GOAL ================= */}
            <div className="flex flex-col relative group">
              
              {/* Step Card Shell */}
              <div className="flex-1 bg-[#0E111A] border border-[#1E2538] hover:border-amber-500/50 rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-glow-gold/20 transition-all duration-300 flex flex-col justify-between">
                
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
                      01
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold px-2.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/20">
                      Step 1
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-rpg text-white mb-2">
                    Create Your Goal
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Choose one meaningful goal and set a deadline for your personal quest.
                  </p>

                  {/* VISUAL: Goal Card */}
                  <div className="bg-[#141824] rounded-xl border border-amber-500/30 p-4 relative overflow-hidden shadow-inner">
                    {/* Top ambient highlight */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Active Campaign
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white mb-3">
                      “Build My First Full-Stack Project”
                    </h4>

                    {/* Badges: Deadline & Difficulty */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-950/50 border border-amber-500/40 text-[11px] font-mono font-semibold text-amber-300">
                        <span>⏳</span> 30-Day Deadline
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950/50 border border-purple-500/40 text-[11px] font-mono font-semibold text-purple-300">
                        <span>⚔️</span> Tier: Heroic
                      </span>
                    </div>

                    {/* Chapter progress */}
                    <div className="mt-3 text-[10px] font-mono text-slate-400 flex justify-between items-center">
                      <span>Decomposed into:</span>
                      <span className="text-amber-400 font-bold">4 Milestone Chapters</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Flow Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Goal Initialized</span>
                  <span className="text-amber-400 font-bold">Ready →</span>
                </div>
              </div>

              {/* Mobile Downward Arrow Connector */}
              <div className="lg:hidden flex justify-center my-3 text-amber-500/50">
                <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* ================= STEP 2: COMPLETE DAILY QUESTS ================= */}
            <div className="flex flex-col relative group">
              
              {/* Step Card Shell */}
              <div className="flex-1 bg-[#0E111A] border border-[#1E2538] hover:border-purple-500/50 rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-glow-purple/20 transition-all duration-300 flex flex-col justify-between">
                
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-sm">
                      02
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-semibold px-2.5 py-0.5 rounded bg-purple-950/40 border border-purple-500/20">
                      Step 2
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-rpg text-white mb-2">
                    Complete Daily Quests
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Break your goal into small daily actions and complete them one quest at a time.
                  </p>

                  {/* VISUAL: 2-3 Quest Cards with Checkboxes & XP */}
                  <div className="space-y-2.5">
                    
                    {/* Quest Card 1 (Completed) */}
                    <div className="bg-[#141824] rounded-lg border border-emerald-500/30 p-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-[10px]">
                          ✓
                        </div>
                        <span className="line-through text-slate-400 font-medium">
                          Build Auth & JWT Routes
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-300 font-mono font-bold text-[10px] shrink-0">
                        +50 XP
                      </span>
                    </div>

                    {/* Quest Card 2 (Completed) */}
                    <div className="bg-[#141824] rounded-lg border border-emerald-500/30 p-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-[10px]">
                          ✓
                        </div>
                        <span className="line-through text-slate-400 font-medium">
                          Design MongoDB Schema
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-300 font-mono font-bold text-[10px] shrink-0">
                        +40 XP
                      </span>
                    </div>

                    {/* Quest Card 3 (Active / In Progress) */}
                    <div className="bg-[#141824] rounded-lg border border-purple-500/40 p-2.5 flex items-center justify-between gap-3 text-xs shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded border border-purple-400 bg-purple-950/40" />
                        <span className="text-slate-200 font-semibold">
                          Code Boss Combat Arena UI
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-purple-950/50 border border-purple-500/40 text-purple-300 font-mono font-bold text-[10px] shrink-0">
                        +60 XP
                      </span>
                    </div>

                    {/* Small Daily Progress Indicator */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>Today's Quests:</span>
                        <span className="text-emerald-400 font-bold">2 of 3 Done (66%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full w-[66%]" />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Flow Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Strike Power Primed</span>
                  <span className="text-purple-400 font-bold">Inflicts DMG →</span>
                </div>
              </div>

              {/* Mobile Downward Arrow Connector */}
              <div className="lg:hidden flex justify-center my-3 text-purple-500/50">
                <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* ================= STEP 3: DEFEAT YOUR BOSS ================= */}
            <div className="flex flex-col relative group">
              
              {/* Step Card Shell */}
              <div className="flex-1 bg-[#0E111A] border border-[#1E2538] hover:border-red-500/50 rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-glow-crimson/20 transition-all duration-300 flex flex-col justify-between">
                
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                      03
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-semibold px-2.5 py-0.5 rounded bg-red-950/40 border border-red-500/20">
                      Step 3
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-rpg text-white mb-2">
                    Defeat Your Boss
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Every completed quest damages your goal boss and moves you closer to victory.
                  </p>

                  {/* VISUAL: Fictional Boss Card with HP Bar Drop & Damage */}
                  <div className="bg-[#141824] rounded-xl border border-red-900/40 p-4 relative overflow-hidden shadow-inner">
                    
                    {/* Floating Damage Indicator */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-600 border border-red-400 text-white font-mono font-black text-[11px] animate-pulse shadow-glow-crimson">
                      -10 HP STRIKE!
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      {/* Mini Boss Icon */}
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-950 to-red-900 border border-red-500/50 flex items-center justify-center shrink-0">
                        <span className="text-base">👹</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-rpg">
                          The Procrastination King
                        </div>
                        <div className="text-[10px] font-mono text-red-400">
                          Boss Level 15 • Nemesis
                        </div>
                      </div>
                    </div>

                    {/* Dynamic HP Bar (From 72% to 62%) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-slate-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          HP Depleted:
                        </span>
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="line-through text-slate-500 text-[10px]">72%</span>
                          <span className="text-amber-400">→</span>
                          <span className="text-red-400">62% HP</span>
                        </div>
                      </div>

                      {/* Health bar with damage chunk highlighted */}
                      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
                        {/* Current 62% bar */}
                        <div 
                          className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-500 shadow-glow-crimson" 
                          style={{ width: '62%' }} 
                        />
                      </div>
                    </div>

                    {/* Victory / Progress Feeling Badge */}
                    <div className="mt-3.5 p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2">
                      <span className="text-emerald-400 text-xs">🏆</span>
                      <span className="text-[11px] font-mono text-emerald-300 font-semibold">
                        Victory Progress: Boss Critical Health!
                      </span>
                    </div>

                  </div>
                </div>

                {/* Bottom Flow Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Goal Accomplished</span>
                  <span className="text-emerald-400 font-bold">Trophy Unlocked ★</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
