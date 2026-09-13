import React from 'react';

export default function DeleteConfirmationModal({
  isOpen,
  quest,
  onClose,
  onConfirm
}) {
  if (!isOpen || !quest) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0B0D14] border border-red-900/50 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient danger accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-2xl mb-4 shadow-glow-crimson mx-auto sm:mx-0">
          ⚠️
        </div>

        {/* Heading */}
        <h3 className="text-xl font-bold font-rpg text-white mb-2 text-center sm:text-left">
          Abandon Quest?
        </h3>

        {/* Target Quest Highlight */}
        <div className="p-3 rounded-xl bg-[#07080E] border border-slate-800 text-xs font-mono text-slate-300 mb-3">
          <span className="text-slate-500 block text-[10px] uppercase">Target Quest:</span>
          <span className="font-semibold text-amber-300">“{quest.title}”</span>
        </div>

        {/* Explanatory Message */}
        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed text-center sm:text-left">
          Are you sure you want to abandon this quest? Abandoning a quest means forfeited XP and delayed campaign progress against your active boss.
        </p>

        {/* Notice */}
        <div className="mb-6 p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 text-[11px] font-mono text-red-300">
          <span className="font-bold">Permanent Action:</span> This quest will be permanently removed from your active roster.
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-mono text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
          >
            Keep Quest
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl font-bold font-mono text-xs text-white bg-gradient-to-r from-red-800 via-red-600 to-red-500 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/40 cursor-pointer"
          >
            ⚔️ Abandon Quest
          </button>
        </div>
      </div>
    </div>
  );
}
