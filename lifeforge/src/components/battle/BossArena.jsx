import React from 'react';
import BossHealthBar from './BossHealthBar';

export default function BossArena({
  bossName = 'THE PROCRASTINATION KING',
  bossLevel = 'LEVEL 08',
  currentHp = 720,
  maxHp = 1000,
  initialHp = 720,
  isHit = false,
  floatingDamage = null
}) {
  const isDefeated = currentHp <= 0;
  const statusLabel = isDefeated ? 'Defeated' : currentHp < 300 ? 'Enraged & Critical' : currentHp < 600 ? 'Weakened' : 'Still standing';
  const statusColor = isDefeated ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40' : currentHp < 300 ? 'text-red-400 bg-red-950/50 border-red-500/50 animate-pulse' : 'text-amber-400 bg-amber-950/40 border-amber-500/40';

  return (
    <div className={`bg-[#0E111A] border border-red-900/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-transform ${isHit ? 'animate-boss-shake ring-2 ring-red-500' : ''}`}>
      
      {/* Ambient Crimson & Purple Glow Flares */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Damage Feedback Alert */}
      {floatingDamage && (
        <div className="absolute top-6 right-8 font-black text-2xl text-red-400 animate-bounce tracking-widest font-mono z-30 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]">
          {floatingDamage}
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#1E2538] relative z-10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Encounter Arena • Boss Confrontation
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-rpg text-white mt-0.5">
            {bossName}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300">
            {bossLevel}
          </span>
          <span className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold ${statusColor}`}>
            Status: {statusLabel}
          </span>
        </div>
      </div>

      {/* Boss Visual Centerpiece & Aura */}
      <div className="my-8 flex flex-col items-center justify-center relative z-10">
        
        {/* Glowing Portal Chamber */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-b from-[#20080E] via-[#10050C] to-[#08080C] border-2 border-red-500/40 flex items-center justify-center shadow-glow-crimson overflow-hidden group">
          
          {/* Pulsing Radial Aura */}
          <div className="absolute inset-0 bg-radial from-red-600/20 via-purple-900/20 to-black/80 pointer-events-none" />
          
          {/* Fictional Boss Titan Illustration */}
          <svg className="w-40 h-40 sm:w-44 sm:h-44 text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-float" viewBox="0 0 100 100" fill="none">
            {/* Horns & Spikes */}
            <path d="M15 45 L25 15 L40 32 L50 10 L60 32 L75 15 L85 45 L78 65 L22 65 Z" fill="#2E0A10" stroke="#EF4444" strokeWidth="2" />
            <circle cx="50" cy="22" r="3.5" fill="#F59E0B" />
            {/* Piercing Glowing Eyes */}
            <circle cx="38" cy="46" r="3.5" fill="#F87171" className="animate-pulse" />
            <circle cx="62" cy="46" r="3.5" fill="#F87171" className="animate-pulse" />
            {/* Fangs */}
            <path d="M34 56 L42 66 L46 56 L50 68 L54 56 L58 66 L66 56" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            {/* Body Plate */}
            <path d="M12 75 Q50 55 88 75 L75 95 L25 95 Z" fill="#1C0508" stroke="#7F1D1D" strokeWidth="2" />
            <circle cx="50" cy="80" r="5" fill="#EF4444" filter="blur(1px)" />
          </svg>

          {/* Solitary Warrior Silhouette in Foreground */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <svg className="w-9 h-11 text-slate-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="4" r="2.8" />
              <path d="M7 10 L12 7 L17 10 L15.5 22 L8.5 22 Z" />
              <line x1="17" y1="4" x2="22" y2="18" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          {/* Floating Embers */}
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 absolute top-8 left-10 animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-12 right-10 animate-pulse" />
        </div>

        <p className="text-xs text-slate-400 font-mono mt-3 text-center">
          Psychological Nemesis • Manifestation of excuses and deferred milestones
        </p>

      </div>

      {/* Large Boss Health Bar Component */}
      <div className="relative z-10 pt-2">
        <BossHealthBar
          currentHp={currentHp}
          maxHp={maxHp}
          initialHp={initialHp}
        />
      </div>

    </div>
  );
}
