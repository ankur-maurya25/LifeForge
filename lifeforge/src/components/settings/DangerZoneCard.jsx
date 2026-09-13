import React from 'react';

export default function DangerZoneCard({
  onRequestReset,
  onLogoutClick
}) {
  return (
    <div className="bg-[#12080B] border border-red-900/50 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-6 relative z-10">
        <h3 className="text-base sm:text-lg font-bold font-rpg text-red-400 flex items-center gap-2">
          <span>⚠️ DANGER ZONE</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/40">
            Session Controls
          </span>
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Careful: actions below alter active session parameters and local profile state
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-4 relative z-10">
        {/* Reset Demo Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#080507] border border-red-900/40">
          <div>
            <h4 className="text-xs sm:text-sm font-bold font-rpg text-slate-100">
              Reset Demo Progress
            </h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Restores character profile, game preferences, and demo counters back to starting defaults.
            </p>
          </div>

          <button
            type="button"
            onClick={onRequestReset}
            className="px-4 py-2.5 rounded-xl font-bold font-mono text-xs text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 hover:border-red-500 transition-all cursor-pointer shrink-0"
          >
            Reset Demo Progress
          </button>
        </div>

        {/* Logout Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#080507] border border-red-900/30">
          <div>
            <h4 className="text-xs sm:text-sm font-bold font-rpg text-slate-100">
              Account Logout
            </h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Securely invalidate your session tokens and return to the main landing portal.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogoutClick}
            className="px-4 py-2.5 rounded-xl font-bold font-mono text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer shrink-0"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
