import React from 'react';

export default function FriendsList({
  friends = [],
  loading = false,
  onRemoveFriend,
  onViewProfile
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">👥</span>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide">
            Friends List ({friends.length})
          </h3>
        </div>
        <span className="text-xs text-neutral-400 font-mono">
          {friends.length} {friends.length === 1 ? 'Allied Hunter' : 'Allied Hunters'}
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-neutral-400 space-y-2">
          <div className="w-7 h-7 mx-auto border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p>Retrieving your guild companions from the realm...</p>
        </div>
      ) : friends.length === 0 ? (
        <div className="py-12 px-4 text-center max-w-sm mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto text-2xl">
            🛡️
          </div>
          <h4 className="text-sm font-bold font-serif text-white">No Companions Added Yet</h4>
          <p className="text-xs text-neutral-400 font-mono">
            Search for fellow adventurers using the search bar above to send friend requests!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {friends.map((friend) => (
            <div
              key={friend._id || friend.username}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center font-bold text-sm text-neutral-200 group-hover:border-purple-500/40 transition-colors">
                    {friend.avatar || (friend.name ? friend.name.charAt(0).toUpperCase() : 'A')}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-neutral-950 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                    title="Active Hunter"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">{friend.name}</span>
                    <span className="text-[11px] font-mono text-neutral-400 font-normal">
                      @{friend.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/25 font-mono text-[10px] font-bold">
                      Lv. {friend.level || 1}
                    </span>
                    <span className="font-mono text-amber-400 text-[11px]">
                      ⚡ {(friend.xp || 0).toLocaleString()} XP
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-red-400 font-mono text-[11px]">
                      🔥 {friend.streak || 0}d
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-emerald-400 font-mono text-[11px]">
                      ✓ {friend.completedQuests || 0} Q
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => onViewProfile && onViewProfile(friend)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveFriend && onRemoveFriend(friend)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 hover:border-red-500/50 transition-colors cursor-pointer"
                  title="Remove friend"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
