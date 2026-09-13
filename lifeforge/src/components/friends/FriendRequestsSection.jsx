import React from 'react';

export default function FriendRequestsSection({
  incoming = [],
  outgoing = [],
  onAccept,
  onReject,
  actionLoadingId = null
}) {
  if (incoming.length === 0 && outgoing.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📫</span>
          <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
            Pending Friend Invocations
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold">
            {incoming.length} Incoming
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
            {outgoing.length} Sent
          </span>
        </div>
      </div>

      {/* 1. Incoming Requests */}
      {incoming.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block font-bold">
            Incoming Requests ({incoming.length})
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incoming.map((req) => {
              const u = req.user;
              const isLoading = actionLoadingId === req._id;

              return (
                <div
                  key={req._id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-black/40 border border-amber-500/20 hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/30 to-purple-600/30 border border-amber-500/40 flex items-center justify-center font-bold text-xs text-amber-300 shrink-0">
                      {u.avatar || u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {u.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block truncate">
                        @{u.username} • Lv.{u.level || 1} • ⚡ {(u.xp || 0).toLocaleString()} XP
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => onAccept && onAccept(req._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? '...' : '✓ Accept'}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => onReject && onReject(req._id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold font-mono bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Outgoing Sent Requests */}
      {outgoing.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Sent Requests Awaiting Response ({outgoing.length})
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {outgoing.map((req) => {
              const u = req.user;

              return (
                <div
                  key={req._id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/25 border border-white/5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-400 shrink-0">
                      {u.avatar || u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-300 block truncate">
                        {u.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block truncate">
                        @{u.username} • Sent {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono shrink-0">
                    ⏳ Awaiting approval
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
