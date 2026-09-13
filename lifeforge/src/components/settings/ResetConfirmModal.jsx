import React from 'react';

export default function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm
}) {
  if (!isOpen) return null;

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
          Reset Demo Progress?
        </h3>

        {/* Explanatory Message */}
        <p className="text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed text-center sm:text-left font-sans">
          This will reset your local demo profile, game preferences, and UI counters back to initial demo defaults.
        </p>

        {/* Notice */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="text-amber-400 font-bold">Local Demo Notice:</span> No backend database is connected yet. This action resets only the active React session state.
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-mono text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl font-bold font-mono text-xs text-white bg-gradient-to-r from-red-800 via-red-600 to-red-500 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/40 cursor-pointer"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
