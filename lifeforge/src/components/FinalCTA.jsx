import React from 'react';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#07080D]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#121624] via-[#0E111A] to-[#07080D] border border-red-500/30 shadow-2xl relative">
          
          <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
            The Arena Awaits
          </span>

          <h2 className="text-3xl sm:text-5xl font-black font-rpg text-white mt-4 mb-6 leading-tight">
            Your next level <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
              starts today.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto mb-8">
            Stop putting off your potential. Forge your goal, equip your habits, and strike down your biggest roadblocks.
          </p>

          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/50 gap-2"
          >
            <span>Start Your Quest</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

        </div>

      </div>
    </section>
  );
}
