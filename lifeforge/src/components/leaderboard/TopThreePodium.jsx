import React from 'react';

/**
 * TopThreePodium component
 * Renders the top 3 players with RPG trophy styling (Gold, Silver, Bronze)
 */
export default function TopThreePodium({ topUsers = [], category = 'xp', currentUserId }) {
  if (!topUsers || topUsers.length === 0) return null;

  // Podium order: 2nd place (Silver), 1st place (Gold), 3rd place (Bronze)
  const first = topUsers[0];
  const second = topUsers.length > 1 ? topUsers[1] : null;
  const third = topUsers.length > 2 ? topUsers[2] : null;

  const podiumOrder = [
    { user: second, place: 2, label: '🥈 2ND PLACE', color: 'border-slate-400/60 bg-slate-800/40 text-slate-200', glow: 'shadow-md', h: 'h-44 sm:h-52' },
    { user: first, place: 1, label: '👑 CHAMPION', color: 'border-amber-500/80 bg-amber-950/40 text-amber-300', glow: 'shadow-glow-gold/30', h: 'h-52 sm:h-64' },
    { user: third, place: 3, label: '🥉 3RD PLACE', color: 'border-amber-700/60 bg-orange-950/40 text-orange-300', glow: 'shadow-md', h: 'h-40 sm:h-48' }
  ];

  const getMetricValue = (user) => {
    if (!user) return '';
    switch (category) {
      case 'level':
        return `Level ${user.level}`;
      case 'quests':
        return `✓ ${user.completedQuests || 0} Quests`;
      case 'streak':
        return `🔥 ${user.streak || 0}d Streak`;
      case 'xp':
      default:
        return `⚡ ${(user.xp || 0).toLocaleString()} XP`;
    }
  };

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Ambient background illumination */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-8 relative z-10">
        <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
          Realm Champions
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-rpg text-white tracking-wide mt-2">
          THE HALL OF GLORY
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Top warriors dominating by {category.toUpperCase()}
        </p>
      </div>

      {/* Podium Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-2xl mx-auto relative z-10 pt-4">
        {podiumOrder.map(({ user, place, label, color, glow, h }) => {
          if (!user) {
            return (
              <div key={place} className="flex flex-col items-center justify-end text-center opacity-40">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-500 mb-2">
                  #{place}
                </div>
                <div className={`w-full ${h} rounded-t-2xl bg-slate-900/40 border-t border-x border-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-600`}>
                  Empty
                </div>
              </div>
            );
          }

          const isCurrentUser = user._id === currentUserId || user.isCurrentUser;

          return (
            <div key={place} className="flex flex-col items-center justify-end text-center group">
              
              {/* Avatar + Crown + Place Tag */}
              <div className="relative mb-3 flex flex-col items-center">
                {place === 1 && (
                  <span className="text-2xl sm:text-3xl animate-bounce mb-1 filter drop-shadow">
                    👑
                  </span>
                )}

                <div
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl p-0.5 border transition-transform duration-300 group-hover:scale-105 ${color} ${glow}`}
                >
                  <div className="w-full h-full rounded-[14px] bg-[#07080E] flex items-center justify-center text-base sm:text-xl font-bold font-rpg text-white">
                    {user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : 'A')}
                  </div>

                  {/* Level Pill */}
                  <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[9px] font-mono font-bold text-amber-300">
                    Lv.{user.level}
                  </span>
                </div>

                <div className="mt-3 min-w-0 max-w-[100px] sm:max-w-[140px]">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs sm:text-sm font-bold font-rpg text-white truncate block">
                      {user.name}
                    </span>
                  </div>
                  {isCurrentUser && (
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-900/80 text-purple-200 border border-purple-500/40 inline-block mt-0.5">
                      YOU
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-400 block truncate">
                    @{user.username}
                  </span>
                </div>
              </div>

              {/* Elevated Podium Block */}
              <div
                className={`w-full ${h} rounded-t-2xl border-t border-x p-3 flex flex-col justify-between items-center transition-all duration-300 ${color} ${glow} ${
                  isCurrentUser ? 'ring-2 ring-purple-500/50' : ''
                }`}
              >
                <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-wider uppercase">
                  {label}
                </span>

                <div className="my-auto space-y-1">
                  <div className="text-xs sm:text-sm font-bold font-mono text-amber-300">
                    {getMetricValue(user)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 hidden sm:block">
                    ⚡ {(user.xp || 0).toLocaleString()} XP
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 hidden sm:block">
                    ✓ {user.completedQuests || 0} Quests • 🔥 {user.streak || 0}d
                  </div>
                </div>

                <span className="text-lg sm:text-2xl font-bold font-rpg text-white/90">
                  #{place}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
