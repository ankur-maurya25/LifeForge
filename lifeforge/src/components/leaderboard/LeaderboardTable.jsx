import React from 'react';

export default function LeaderboardTable({
  users = [],
  currentUserId,
  currentUsername,
  category = 'xp',
  loading = false,
  error = '',
  onRetry
}) {
  const getRankBadge = (rank) => {
    if (rank === 1) {
      return {
        badge: '👑 #1',
        style: 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-glow-gold/30 font-bold',
        avatarGrad: 'from-amber-400 to-yellow-600'
      };
    }
    if (rank === 2) {
      return {
        badge: '🥈 #2',
        style: 'bg-slate-800 text-slate-200 border-slate-400/60 shadow-md font-bold',
        avatarGrad: 'from-slate-300 to-slate-500'
      };
    }
    if (rank === 3) {
      return {
        badge: '🥉 #3',
        style: 'bg-orange-950/80 text-orange-300 border-orange-500/60 shadow-md font-bold',
        avatarGrad: 'from-amber-600 to-orange-700'
      };
    }
    return {
      badge: `#${rank}`,
      style: 'bg-slate-900/80 text-slate-400 border-slate-800',
      avatarGrad: 'from-purple-600 to-indigo-600'
    };
  };

  const getRankTitle = (user) => {
    const level = user.level || 1;
    if (level >= 15) return 'Shadow Monarch';
    if (level >= 10) return 'Apex Slayer';
    if (level >= 5) return 'Rising Builder';
    return 'Novice Hunter';
  };

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl shadow-xl overflow-hidden">
      
      {/* Table Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white flex items-center gap-2">
            <span>REALM RANKINGS</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30">
              {users.length} Active Hunters
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ranked by {category === 'xp' ? 'Total XP' : category === 'level' ? 'Hunter Level' : category === 'quests' ? 'Completed Quests' : 'Current Streak'} with stable tie-breaking
          </p>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Rankings</span>
        </span>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 text-center space-y-3">
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono max-w-lg mx-auto flex items-center justify-between gap-3">
            <span>⚠️ {error}</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 text-xs cursor-pointer shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-slate-400 space-y-3">
          <div className="w-8 h-8 mx-auto border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p>Summoning leaderboard rankings from the LifeForge database...</p>
        </div>
      ) : users.length === 0 && !error ? (
        /* Empty State */
        <div className="py-16 px-4 text-center max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-2xl">
            🏆
          </div>
          <h4 className="text-base font-bold font-rpg text-white">No Champions Found Yet</h4>
          <p className="text-xs text-slate-400 font-mono">
            Be the first warrior to complete a quest and claim the number one spot in the realm!
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#07080E]/60 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6 font-semibold">Rank</th>
                  <th className="py-3.5 px-6 font-semibold">Champion</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Level</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Total XP</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Quests</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Streak</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Title</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map((user) => {
                  const isCurrentUser =
                    (currentUserId && user._id === currentUserId) ||
                    (currentUsername && user.username === currentUsername) ||
                    user.isCurrentUser;
                  const rankInfo = getRankBadge(user.rank);

                  return (
                    <tr
                      key={user._id || user.username || user.rank}
                      className={`transition-colors duration-150 ${
                        isCurrentUser
                          ? 'bg-purple-950/30 hover:bg-purple-950/40 border-l-4 border-l-purple-500 shadow-inner'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-lg border text-xs ${rankInfo.style}`}
                        >
                          {rankInfo.badge}
                        </span>
                      </td>

                      {/* Champion Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${
                              isCurrentUser ? 'from-red-600 to-amber-500' : rankInfo.avatarGrad
                            } p-0.5 shrink-0 shadow-sm`}
                          >
                            <div className="w-full h-full rounded-[10px] bg-[#090A10] flex items-center justify-center text-xs font-bold font-rpg text-white">
                              {user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : 'A')}
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold font-rpg text-white text-sm truncate">
                                {user.name}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-900/80 text-purple-200 border border-purple-500/40">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono block">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Level */}
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${
                          category === 'level'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                            : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}>
                          Lv.{user.level}
                        </span>
                      </td>

                      {/* Total XP */}
                      <td className={`py-4 px-6 text-right font-bold text-sm ${
                        category === 'xp' ? 'text-amber-400 font-extrabold' : 'text-slate-200'
                      }`}>
                        ⚡ {(user.xp || 0).toLocaleString()} XP
                      </td>

                      {/* Completed Quests */}
                      <td className={`py-4 px-4 text-center font-semibold ${
                        category === 'quests' ? 'text-emerald-300 font-bold' : 'text-emerald-400'
                      }`}>
                        ✓ {user.completedQuests || 0}
                      </td>

                      {/* Streak */}
                      <td className={`py-4 px-4 text-center font-semibold ${
                        category === 'streak' ? 'text-orange-300 font-bold' : 'text-red-400'
                      }`}>
                        🔥 {user.streak || 0}d
                      </td>

                      {/* Rank Title */}
                      <td className="py-4 px-6 text-right">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#07080E] text-slate-300 border border-slate-800">
                          {getRankTitle(user)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE STACKED CARDS VIEW */}
          <div className="md:hidden divide-y divide-slate-800/60">
            {users.map((user) => {
              const isCurrentUser =
                (currentUserId && user._id === currentUserId) ||
                (currentUsername && user.username === currentUsername) ||
                user.isCurrentUser;
              const rankInfo = getRankBadge(user.rank);

              return (
                <div
                  key={user._id || user.username || user.rank}
                  className={`p-4 transition-colors space-y-3 ${
                    isCurrentUser
                      ? 'bg-purple-950/25 border-l-4 border-l-purple-500'
                      : 'bg-[#0E111A]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`inline-flex items-center justify-center font-bold px-2 py-1 rounded-lg border text-xs shrink-0 ${rankInfo.style}`}
                      >
                        {rankInfo.badge}
                      </span>

                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${
                          isCurrentUser ? 'from-red-600 to-amber-500' : rankInfo.avatarGrad
                        } p-0.5 shrink-0`}
                      >
                        <div className="w-full h-full rounded-[10px] bg-[#090A10] flex items-center justify-center text-xs font-bold font-rpg text-white">
                          {user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : 'A')}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold font-rpg text-white text-sm truncate">
                            {user.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-900/80 text-purple-200 border border-purple-500/40">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          @{user.username} • Lv.{user.level}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#07080E] text-slate-300 border border-slate-800 shrink-0">
                      {getRankTitle(user)}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#07080E] border border-slate-800/80 text-xs font-mono text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">XP</span>
                      <span className={`font-bold ${category === 'xp' ? 'text-amber-300' : 'text-slate-200'}`}>
                        ⚡ {(user.xp || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Quests</span>
                      <span className={`font-bold ${category === 'quests' ? 'text-emerald-300' : 'text-emerald-400'}`}>
                        ✓ {user.completedQuests || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Streak</span>
                      <span className={`font-bold ${category === 'streak' ? 'text-orange-300' : 'text-red-400'}`}>
                        🔥 {user.streak || 0}d
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}
