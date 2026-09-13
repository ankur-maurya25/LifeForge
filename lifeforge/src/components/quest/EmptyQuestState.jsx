import React from 'react';

export default function EmptyQuestState({
  hasFilters = false,
  onResetFilters,
  onCreateQuest
}) {
  return (
    <div className="bg-[#0E111A] border border-slate-800 rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto shadow-2xl relative overflow-hidden my-6">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Runic Emblem */}
      <div className="w-16 h-16 rounded-2xl bg-[#141824] border border-slate-700/60 flex items-center justify-center mx-auto mb-4 text-3xl shadow-glow-crimson/20">
        ⚔️
      </div>

      {/* Primary Message */}
      <h3 className="text-xl sm:text-2xl font-bold font-rpg text-white mb-2 tracking-wide">
        No quests found.
      </h3>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-slate-400 font-mono mb-6 max-w-md mx-auto">
        {hasFilters
          ? 'No quests match your current filters or search criteria. Reset filters or create a new quest.'
          : 'Create a new quest and start making progress.'}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {hasFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2.5 rounded-xl font-mono text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        )}

        <button
          onClick={onCreateQuest}
          className="px-5 py-2.5 rounded-xl font-bold font-rpg text-xs text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/40 cursor-pointer"
        >
          + Create New Quest
        </button>
      </div>
    </div>
  );
}
