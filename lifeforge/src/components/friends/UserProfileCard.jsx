import React from 'react';

export default function UserProfileCard({
  user = null,
  friendsCount = 0
}) {
  const name = user?.name || 'Hunter';
  const username = user?.username || 'hunter';
  const level = user?.level || 1;
  const xp = typeof user?.xp === 'number' ? user.xp : 0;
  const streak = typeof user?.streak === 'number' ? user.streak : 0;
  const avatar = user?.avatar || name.charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Avatar with Status Ring */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-amber-500 p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <div className="w-full h-full rounded-2xl bg-neutral-900 flex items-center justify-center font-serif text-2xl font-black text-amber-300">
              {avatar}
            </div>
          </div>
          <span
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-neutral-950 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            title="Online"
          />
        </div>

        {/* User Stats & Badges */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-serif font-bold text-white tracking-wide truncate">
              {name}
            </h2>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Lv. {level}
            </span>
          </div>

          <p className="text-xs text-neutral-400 mt-1">
            @{username} • <span className="text-purple-300 font-semibold">{friendsCount} {friendsCount === 1 ? 'Friend' : 'Friends'}</span>
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5">
            <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              <div className="text-[10px] text-neutral-400 font-mono">Total XP</div>
              <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                ⚡ {xp.toLocaleString()}
              </div>
            </div>
            <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              <div className="text-[10px] text-neutral-400 font-mono">Active Streak</div>
              <div className="text-xs font-mono font-bold text-red-400 mt-0.5">
                🔥 {streak} days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
