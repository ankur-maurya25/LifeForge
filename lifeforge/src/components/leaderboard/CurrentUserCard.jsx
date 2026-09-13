import React from 'react';

export default function CurrentUserCard({
  user = null,
  category = 'xp'
}) {
  if (!user) return null;

  const getRankTitle = (lvl) => {
    const level = lvl || 1;
    if (level >= 15) return 'SHADOW MONARCH';
    if (level >= 10) return 'APEX SLAYER';
    if (level >= 5) return 'RISING BUILDER';
    return 'NOVICE HUNTER';
  };

  const name = user.name || 'Anonymous Hunter';
  const username = user.username || 'hunter';
  const rank = user.rank || 1;
  const level = user.level || 1;
  const xp = typeof user.xp === 'number' ? user.xp : 0;
  const completedQuests = typeof user.completedQuests === 'number' ? user.completedQuests : 0;
  const streak = typeof user.streak === 'number' ? user.streak : 0;
  const longestStreak = typeof user.longestStreak === 'number' ? user.longestStreak : streak;
  const avatar = user.avatar || name.charAt(0).toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#120F24] via-[#0E1326] to-[#0A0D18] border border-purple-500/40 p-5 sm:p-7 shadow-2xl">
      {/* Ambient energetic glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Rank Badge + Avatar + User Info */}
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          
          {/* Standing Rank Pill */}
          <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#080714] border border-purple-500/50 shrink-0 shadow-glow-purple/30">
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
              YOUR RANK
            </span>
            <span className="text-xl sm:text-2xl font-bold font-rpg text-amber-300">
              #{rank}
            </span>
          </div>

          {/* Avatar with gradient border */}
          <div className="relative shrink-0">
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-red-600 via-purple-600 to-amber-500 p-0.5 shadow-glow-crimson/30">
              <div className="w-full h-full rounded-2xl bg-[#080A10] flex items-center justify-center text-xl font-bold font-rpg text-amber-400">
                {avatar}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-purple-600 text-[10px] font-mono font-bold text-white border border-[#0E111A]">
              Lv.{level}
            </span>
          </div>

          {/* User Name & Titles */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold font-rpg text-white truncate">
                {name}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/40">
                YOU
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono mt-0.5">
              @{username} • <span className="text-amber-400 font-semibold">{getRankTitle(level)}</span>
            </p>
          </div>
        </div>

        {/* Right: Real-time Stats Trio */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full md:w-auto text-xs font-mono">
          
          {/* XP */}
          <div className={`p-3 rounded-xl border text-center sm:text-left min-w-[95px] ${
            category === 'xp' ? 'bg-purple-950/40 border-purple-400' : 'bg-[#070812] border-purple-500/30'
          }`}>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Total XP
            </span>
            <span className="text-sm sm:text-base font-bold text-amber-400 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
              <span>⚡</span> {xp.toLocaleString()}
            </span>
          </div>

          {/* Completed Quests */}
          <div className={`p-3 rounded-xl border text-center sm:text-left min-w-[95px] ${
            category === 'quests' ? 'bg-emerald-950/40 border-emerald-400' : 'bg-[#070812] border-purple-500/30'
          }`}>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Quests
            </span>
            <span className="text-sm sm:text-base font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
              <span>✓</span> {completedQuests}
            </span>
          </div>

          {/* Streak */}
          <div className={`p-3 rounded-xl border text-center sm:text-left min-w-[95px] ${
            category === 'streak' ? 'bg-orange-950/40 border-orange-400' : 'bg-[#070812] border-purple-500/30'
          }`}>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Streak
            </span>
            <span className="text-sm sm:text-base font-bold text-red-400 flex items-center justify-center sm:justify-start gap-1 mt-0.5" title={`Longest Streak: ${longestStreak}d`}>
              <span>🔥</span> {streak}d
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
