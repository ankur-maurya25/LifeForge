import React, { useState } from 'react';

const INITIAL_QUESTS = [
  { id: 1, title: 'Code React Layout & Routes (45 min)', xp: 45, damage: 40, stat: 'Focus', completed: false },
  { id: 2, title: 'Review Database & Indexing Concepts', xp: 35, damage: 30, stat: 'Discipline', completed: false },
  { id: 3, title: 'Hydration Sprint & 20 min Cardio', xp: 25, damage: 20, stat: 'Vitality', completed: false },
];

export default function BossVisual() {
  const [bossHp, setBossHp] = useState(740);
  const maxHp = 1000;
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [playerXp, setPlayerXp] = useState(380);
  const [hitAnimation, setHitAnimation] = useState(false);
  const [floatingDmg, setFloatingDmg] = useState(null);

  const handleToggleQuest = (id) => {
    const target = quests.find(q => q.id === id);
    if (!target) return;

    if (!target.completed) {
      // Inflict damage
      setBossHp(prev => Math.max(0, prev - target.damage));
      setPlayerXp(prev => prev + target.xp);
      setFloatingDmg(`-${target.damage} CRITICAL HIT!`);
      setHitAnimation(true);
      setTimeout(() => setHitAnimation(false), 400);
      setTimeout(() => setFloatingDmg(null), 1200);

      setQuests(quests.map(q => q.id === id ? { ...q, completed: true } : q));
    } else {
      // Revert
      setBossHp(prev => Math.min(maxHp, prev + target.damage));
      setPlayerXp(prev => Math.max(0, prev - target.xp));
      setQuests(quests.map(q => q.id === id ? { ...q, completed: false } : q));
    }
  };

  const hpPercentage = Math.round((bossHp / maxHp) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Outer Glow & Card Container */}
      <div className="relative rounded-2xl bg-[#0B0D14] border border-[#1E2538] p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Atmospheric Red/Purple Lighting */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Battle Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1E2538] relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                Active Encounter • 30-Day Campaign
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-rpg text-white mt-1">
              "Master Full-Stack Engineering in 30 Days"
            </h2>
          </div>

          {/* Player Mini Status */}
          <div className="flex items-center gap-3 bg-[#141824] px-4 py-2 rounded-xl border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-rpg font-bold text-black text-sm shadow-glow-gold/40">
              IV
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Hero Level 4</div>
              <div className="text-[11px] font-mono text-amber-400">{playerXp} / 500 XP</div>
            </div>
          </div>
        </div>

        {/* The Battle Grid: Boss Arena on Left, Quests on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center relative z-10">
          
          {/* BOSS CARD (5 Cols) */}
          <div className={`lg:col-span-5 rounded-2xl bg-[#07080E] border border-red-900/40 p-6 flex flex-col items-center text-center relative transition-transform ${hitAnimation ? 'animate-boss-shake ring-2 ring-red-500' : ''}`}>
            
            {/* Floating Damage Indicator */}
            {floatingDmg && (
              <div className="absolute -top-3 font-black text-xl text-red-500 animate-bounce tracking-widest font-mono drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] z-20">
                {floatingDmg}
              </div>
            )}

            {/* Boss Cinematic Artwork Emblem Inspired by Shadow Beast / Dragon Reference */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-[#1E080C] via-[#0E050A] to-[#05060A] border-2 border-red-600/40 flex items-center justify-center shadow-glow-crimson overflow-hidden mb-5">
              
              {/* Radial red flare and smoky haze */}
              <div className="absolute inset-0 bg-radial from-red-600/25 via-red-950/20 to-black/90 pointer-events-none" />
              
              {/* Draconic Shadow Titan Artwork */}
              <svg className="w-48 h-48 sm:w-56 sm:h-56 text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-float" viewBox="0 0 200 200" fill="none">
                {/* Serpentine Dragon / Shadow Coils */}
                <path d="M40 140 C20 90, 45 40, 100 35 C155 40, 180 90, 160 140 C145 170, 55 170, 40 140 Z" fill="#150508" stroke="#7F1D1D" strokeWidth="2.5" />
                
                {/* Magma Fissure Lines on Coils */}
                <path d="M50 120 Q80 80 100 110 T150 120" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                <path d="M60 150 Q100 130 140 150" stroke="#EF4444" strokeWidth="2" opacity="0.7" />
                
                {/* Horns / Dragon Crest */}
                <path d="M70 65 L45 25 L85 50 L100 15 L115 50 L155 25 L130 65 Z" fill="#2E0A0F" stroke="#EF4444" strokeWidth="2.5" />
                
                {/* Golden Crown / Horn Gem */}
                <polygon points="100,28 106,38 100,48 94,38" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1" />
                <polygon points="65,38 70,45 65,52 60,45" fill="#9333EA" />
                <polygon points="135,38 140,45 135,52 130,45" fill="#9333EA" />

                {/* Snout and Jaws */}
                <path d="M75 75 Q100 60 125 75 L115 105 Q100 120 85 105 Z" fill="#1C060A" stroke="#EF4444" strokeWidth="2" />
                
                {/* Piercing Glowing Red Eyes */}
                <ellipse cx="86" cy="80" rx="5" ry="3" fill="#F87171" className="animate-pulse" />
                <circle cx="86" cy="80" r="1.5" fill="#FFFFFF" />
                <ellipse cx="114" cy="80" rx="5" ry="3" fill="#F87171" className="animate-pulse" />
                <circle cx="114" cy="80" r="1.5" fill="#FFFFFF" />

                {/* Whiskers / Horn tendrils */}
                <path d="M78 95 Q60 105 45 125" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M122 95 Q140 105 155 125" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />

                {/* Fiery Chest Core */}
                <circle cx="100" cy="142" r="8" fill="#EF4444" filter="blur(2px)" />
                <circle cx="100" cy="142" r="4" fill="#FEF08A" />
              </svg>

              {/* Solitary Warrior Silhouette Facing The Dragon */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <svg className="w-10 h-12 text-slate-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="4" r="2.8" />
                  <path d="M7 10 L12 7 L17 10 L15.5 22 L8.5 22 Z" />
                  <line x1="17" y1="4" x2="22" y2="18" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              {/* Tier Badge */}
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 border border-red-500/50 text-[10px] font-mono font-bold text-red-400">
                Tier: Disaster Boss
              </div>
            </div>

            {/* Boss Name */}
            <h3 className="text-xl sm:text-2xl font-bold font-rpg text-white tracking-wide">
              The Procrastination King
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Titan of Excuses & Postponed Ambitions
            </p>

            {/* Boss HP Bar */}
            <div className="w-full mt-5">
              <div className="flex justify-between items-center text-xs font-mono font-bold mb-1.5">
                <span className="text-red-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-red-500" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  BOSS HP
                </span>
                <span className="text-slate-300">
                  {bossHp} / {maxHp} ({hpPercentage}%)
                </span>
              </div>
              
              <div className="h-3.5 w-full bg-black/90 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-red-700 via-red-500 to-amber-500 shadow-glow-crimson"
                  style={{ width: `${hpPercentage}%` }}
                />
              </div>
            </div>

          </div>

          {/* QUESTS & ATTACK CONNECTION (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Connection Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-transparent border border-red-500/25 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                  <line x1="13" y1="19" x2="19" y2="13" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong className="text-white">Direct Damage Link:</strong> Every quest you complete deals damage directly to <span className="text-red-400 font-semibold">The Procrastination King</span> and boosts your XP.
              </p>
            </div>

            {/* Daily Quests List */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                <span>Daily Combat Quests (Click to Strike)</span>
                <span>{quests.filter(q => q.completed).length} / {quests.length} Slayed</span>
              </div>

              <div className="space-y-3">
                {quests.map(quest => (
                  <button
                    key={quest.id}
                    onClick={() => handleToggleQuest(quest.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                      quest.completed 
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-400' 
                        : 'bg-[#141824] border-[#1E2538] hover:border-red-500/40 hover:bg-[#191F30] text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Checkbox indicator */}
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        quest.completed 
                          ? 'bg-emerald-500 border-emerald-400 text-black' 
                          : 'border-slate-600 bg-slate-900/50'
                      }`}>
                        {quest.completed && (
                          <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>

                      <div>
                        <div className={`text-sm font-semibold ${quest.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {quest.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-amber-400 font-bold">+{quest.xp} XP</span>
                          <span>•</span>
                          <span className="text-purple-400">+{quest.stat} Attribute</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                        quest.completed 
                          ? 'bg-slate-800 border-slate-700 text-slate-400' 
                          : 'bg-red-950/60 border-red-500/40 text-red-400'
                      }`}>
                        ⚔️ -{quest.damage} DMG
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Progression Preview Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-lg bg-[#141824] border border-purple-500/30 text-purple-300">
                ⚡ Focus: +15 Boosted
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#141824] border border-amber-500/30 text-amber-300">
                🛡️ Discipline: 8-Day Streak
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#141824] border border-red-500/30 text-red-300">
                🔥 Critical Strike Active
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
