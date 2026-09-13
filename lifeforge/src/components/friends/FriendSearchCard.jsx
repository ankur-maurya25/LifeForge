import React, { useState } from 'react';

export default function FriendSearchCard({
  onSearch,
  searchResults = [],
  searchLoading = false,
  onSendRequest,
  onAcceptRequest,
  sendingId = null
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) onSearch('');
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🔍</span>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide">
            Find & Invite Hunters
          </h3>
        </div>
        <p className="text-xs text-neutral-400 font-mono mb-4">
          Search warriors by username or display name to forge an alliance
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter username or display name..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500/60 focus:outline-none text-xs font-mono text-white placeholder-neutral-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={searchLoading || !searchTerm.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-purple-500/20 disabled:opacity-50 cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            {searchLoading ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </form>
      </div>

      {/* Search Results List */}
      <div className="space-y-2 mt-2">
        {searchLoading ? (
          <div className="p-4 text-center text-xs font-mono text-neutral-400">
            Scanning the realm for matches...
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {searchResults.map((user) => {
              const isSending = sendingId === user._id;

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-xs text-amber-300 shrink-0">
                      {user.avatar || user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 block truncate">
                        @{user.username} • Lv.{user.level || 1} • ⚡ {(user.xp || 0).toLocaleString()} XP
                      </span>
                    </div>
                  </div>

                  {/* Relationship Action */}
                  <div className="shrink-0">
                    {user.relationship === 'friends' ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                        ✓ Friends
                      </span>
                    ) : user.relationship === 'pending_sent' ? (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
                        ⏳ Sent
                      </span>
                    ) : user.relationship === 'pending_received' ? (
                      <button
                        type="button"
                        onClick={() => onAcceptRequest && onAcceptRequest(user.requestId)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-mono font-bold transition-colors cursor-pointer"
                      >
                        Accept
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isSending}
                        onClick={() => onSendRequest && onSendRequest(user._id)}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-[10px] font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSending ? 'Sending...' : '+ Add Friend'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : searchTerm.trim() ? (
          <div className="p-3 text-center text-xs font-mono text-neutral-400 bg-white/[0.02] rounded-xl border border-white/5">
            No hunters found matching "{searchTerm}". Check the spelling or invite new friends!
          </div>
        ) : null}
      </div>
    </div>
  );
}
