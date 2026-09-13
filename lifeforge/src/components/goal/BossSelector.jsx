import React from 'react';

export const BOSS_OPTIONS = [
  {
    id: 'procrastination-king',
    name: 'The Procrastination King',
    title: 'Titan of Delays & Postponed Habits',
    description: 'Preys on "I will start tomorrow." Weak to micro-sprints and early morning quest completions.',
    accent: 'crimson',
    themeColor: '#EF4444',
    badge: 'Disaster Tier',
    icon: (
      <svg className="w-8 h-8 text-red-500" viewBox="0 0 100 100" fill="none">
        <path d="M25 40 L35 20 L45 32 L50 15 L55 32 L65 20 L75 40 L70 60 L30 60 Z" fill="#24070A" stroke="#EF4444" strokeWidth="2.5" />
        <circle cx="50" cy="24" r="3" fill="#F59E0B" />
        <circle cx="42" cy="45" r="3.5" fill="#EF4444" className="animate-pulse" />
        <circle cx="58" cy="45" r="3.5" fill="#EF4444" className="animate-pulse" />
      </svg>
    )
  },
  {
    id: 'deadline-dragon',
    name: 'The Deadline Dragon',
    title: 'Serpent of Ticking Clocks & Panic',
    description: 'Breathes intense pressure as deadlines near. Can only be subdued by consistent incremental pacing.',
    accent: 'amber',
    themeColor: '#F59E0B',
    badge: 'Infernal Tier',
    icon: (
      <svg className="w-8 h-8 text-amber-500" viewBox="0 0 100 100" fill="none">
        <path d="M20 70 Q50 30 80 70 Q50 50 20 70 Z" fill="#2C1808" stroke="#F59E0B" strokeWidth="2.5" />
        <circle cx="50" cy="42" r="4" fill="#F59E0B" className="animate-ping" />
        <path d="M40 30 L50 15 L60 30" stroke="#EF4444" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 'focus-breaker',
    name: 'The Focus Breaker',
    title: 'Siren of Infinite Feeds & Notifications',
    description: 'Spawns digital distractions to shatter deep work blocks. Weak to app-blockers and Pomodoro shields.',
    accent: 'purple',
    themeColor: '#A855F7',
    badge: 'Illusion Tier',
    icon: (
      <svg className="w-8 h-8 text-purple-400" viewBox="0 0 100 100" fill="none">
        <polygon points="50,15 80,45 50,75 20,45" fill="#1C0928" stroke="#A855F7" strokeWidth="2.5" />
        <circle cx="50" cy="45" r="6" fill="#A855F7" />
        <circle cx="50" cy="45" r="2" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    id: 'consistency-beast',
    name: 'The Consistency Beast',
    title: 'Gargoyle of Broken Streaks',
    description: 'Feeds on days off and skipped workouts. Demands steady daily check-ins to prevent its armor from thickening.',
    accent: 'emerald',
    themeColor: '#10B981',
    badge: 'Gargantuan Tier',
    icon: (
      <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 100 100" fill="none">
        <path d="M25 35 L50 20 L75 35 L70 75 L30 75 Z" fill="#082015" stroke="#10B981" strokeWidth="2.5" />
        <path d="M35 50 L65 50" stroke="#10B981" strokeWidth="3" />
        <circle cx="50" cy="62" r="3" fill="#10B981" />
      </svg>
    )
  }
];

export default function BossSelector({
  selectedBossId,
  setSelectedBossId,
  difficulty
}) {
  const selectedBoss = BOSS_OPTIONS.find(b => b.id === selectedBossId) || BOSS_OPTIONS[0];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 sm:p-7 shadow-xl">
      
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono text-red-400 uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30">
            Nemesis Manifestation
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-rpg text-white mt-2">
            Choose Your Boss
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Pick the psychological barrier you are battling against.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-[#141824] border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Selected: </span>
          <span className="text-red-400 font-bold">{selectedBoss.name}</span>
        </div>
      </div>

      {/* 4 Boss Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        {BOSS_OPTIONS.map((boss) => {
          const isSelected = selectedBossId === boss.id;
          return (
            <div
              key={boss.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setSelectedBossId(boss.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setSelectedBossId(boss.id);
                }
              }}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                isSelected
                  ? 'bg-[#181524] border-red-500 shadow-glow-crimson/30 ring-1 ring-red-500'
                  : 'bg-[#141824] border-[#1E2538] hover:border-slate-600 hover:bg-[#1A2030]'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                {boss.icon}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-bold font-rpg text-white truncate">
                    {boss.name}
                  </h3>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                  {boss.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-black/50 border border-slate-800 text-slate-300">
                    {boss.badge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Boss Preview Strip */}
      <div className="p-4 rounded-xl bg-[#080A10] border border-red-900/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedBoss.themeColor }} />
          <div>
            <span className="text-xs font-bold text-white font-mono">
              Boss Aura Preview: {selectedBoss.name}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              Encounter Difficulty: {difficulty} Mode Active
            </span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-red-950/60 border border-red-500/40 text-red-300">
          Tier: {selectedBoss.badge}
        </span>
      </div>

    </div>
  );
}
