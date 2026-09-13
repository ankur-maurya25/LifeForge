import React from 'react';

export default function PartySection({
  partyName = 'Code Warriors',
  leader = 'Ankur Maurya',
  membersCount = 3,
  maxMembers = 5,
  partyXp = '8,420 XP',
  partyStreak = '14 days',
  inParty = true,
  onJoinParty,
  onLeaveParty
}) {
  const members = [
    { name: 'Ankur Maurya', role: 'Party Leader', level: 8, avatar: 'AM', isOnline: true },
    { name: 'Aryan Sharma', role: 'DPS Striker', level: 11, avatar: 'AS', isOnline: true },
    { name: 'Riya Sen', role: 'Support Guardian', level: 9, avatar: 'RS', isOnline: false },
  ];

  const capacityPercentage = Math.round((membersCount / maxMembers) * 100);

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 via-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">
              {partyName}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
              {inParty ? 'Active Party' : 'Available Party'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Party Leader: <span className="text-neutral-200 font-semibold">{leader}</span>
          </p>
        </div>

        {/* Join / Leave Buttons */}
        <div className="flex items-center gap-2">
          {inParty ? (
            <button
              onClick={onLeaveParty}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20"
            >
              Leave Party
            </button>
          ) : (
            <button
              onClick={onJoinParty}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-purple-500/25"
            >
              Join Party
            </button>
          )}
        </div>
      </div>

      {/* Party Stats Overview */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <div className="text-[10px] text-neutral-400">Members</div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">
            {membersCount}/{maxMembers}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <div className="text-[10px] text-neutral-400">Party XP</div>
          <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">{partyXp}</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <div className="text-[10px] text-neutral-400">Party Streak</div>
          <div className="text-sm font-mono font-bold text-red-400 mt-0.5">🔥 {partyStreak}</div>
        </div>
      </div>

      {/* Party Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1 font-mono">
          <span className="text-neutral-400 text-[11px]">Party Capacity & Momentum</span>
          <span className="text-purple-300 font-bold">{capacityPercentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-neutral-800 border border-white/10 overflow-hidden">
          <div
            style={{ width: `${capacityPercentage}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Member Roster Preview */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-neutral-300">Party Roster:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {members.map((m) => (
            <div
              key={m.name}
              className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-xs text-neutral-300">
                  {m.avatar}
                </div>
                {m.isOnline && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{m.name}</div>
                <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                  <span className="text-amber-400 font-mono">Lv.{m.level}</span>
                  <span>•</span>
                  <span>{m.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
