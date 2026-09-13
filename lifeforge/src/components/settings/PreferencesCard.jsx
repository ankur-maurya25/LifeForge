import React from 'react';

export default function PreferencesCard({
  preferences,
  onTogglePreference
}) {
  const items = [
    {
      id: 'dailyReminders',
      title: 'Daily Quest Reminders',
      description: 'Send notifications when daily boss damage habits are due',
      icon: '🔔'
    },
    {
      id: 'soundEffects',
      title: 'Combat Sound Effects',
      description: 'Play retro RPG audio upon quest strike and level up',
      icon: '🔊'
    },
    {
      id: 'showCompletedQuests',
      title: 'Show Completed Quests',
      description: 'Keep completed daily quest cards visible in dashboard stack',
      icon: '✓'
    },
    {
      id: 'compactView',
      title: 'Compact Dashboard View',
      description: 'Condense stat meters and milestone roadmap for tighter display',
      icon: '📐'
    }
  ];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-bold font-rpg text-white flex items-center gap-2">
          <span>GAME PREFERENCES</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950/40 text-cyan-300 border border-cyan-500/30">
            Gameplay
          </span>
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Customize your daily RPG productivity flow and notification alerts
        </p>
      </div>

      {/* Switches list */}
      <div className="space-y-4">
        {items.map((item) => {
          const isChecked = Boolean(preferences[item.id]);

          return (
            <div
              key={item.id}
              onClick={() => onTogglePreference(item.id)}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#07080E] border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer select-none group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold font-rpg text-white group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* iOS-Style RPG Toggle Switch */}
              <div
                role="switch"
                aria-checked={isChecked}
                className={`w-12 h-6.5 rounded-full transition-colors relative shrink-0 p-0.5 flex items-center border ${
                  isChecked
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 border-amber-400/50 shadow-glow-crimson/20'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-md ${
                    isChecked ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
