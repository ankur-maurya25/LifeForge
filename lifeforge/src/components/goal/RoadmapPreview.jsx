import React from 'react';

const EXAMPLE_MILESTONES = [
  { step: '01', title: 'Plan the project', desc: 'Architecture, schema design & user flow', color: 'border-blue-500/40 text-blue-400' },
  { step: '02', title: 'Build frontend', desc: 'Vite + React UI components & responsive views', color: 'border-cyan-500/40 text-cyan-400' },
  { step: '03', title: 'Create backend', desc: 'Node.js + Express API endpoints & JWT auth', color: 'border-purple-500/40 text-purple-400' },
  { step: '04', title: 'Connect database', desc: 'MongoDB models, indexes & validation', color: 'border-amber-500/40 text-amber-400' },
  { step: '05', title: 'Test and deploy', desc: 'Integration verification & live production launch', color: 'border-emerald-500/40 text-emerald-400' },
];

export default function RoadmapPreview({ goalTitle = 'Build my first full-stack project' }) {
  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 sm:p-7 shadow-xl">
      
      {/* Header & Notice */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30">
            Automated Decomposition
          </span>
          <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
            5 Chapters
          </span>
        </div>

        <h3 className="text-xl font-bold font-rpg text-white">
          Your Quest Roadmap
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Goal → Milestones → Daily Quests → Final Boss Battle
        </p>
      </div>

      {/* Clearly labeled preview badge */}
      <div className="mb-5 p-3 rounded-xl bg-[#141824] border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
        <span>✨</span>
        <span>
          <strong>Preview:</strong> AI-generated breakdown will be connected later.
        </span>
      </div>

      {/* 5 Milestone Chapters Timeline */}
      <div className="space-y-3 relative">
        
        {/* Subtle vertical connector line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-emerald-500/40 pointer-events-none" />

        {EXAMPLE_MILESTONES.map((m, idx) => (
          <div
            key={m.step}
            className="flex items-start gap-3.5 p-3 rounded-xl bg-[#141824] border border-[#1E2538] hover:border-slate-700 transition-colors relative z-10"
          >
            <div className={`w-8 h-8 rounded-lg bg-slate-900 border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${m.color}`}>
              {m.step}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white truncate font-rpg">
                  {m.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500">
                  Chapter {idx + 1}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {m.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Final Boss Battle Milestone Pin */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-red-950/40 to-purple-950/40 border border-red-500/40 flex items-center justify-between gap-3 text-xs font-mono relative z-10 shadow-glow-crimson/20">
          <div className="flex items-center gap-2.5">
            <span className="text-base">👹</span>
            <div>
              <span className="font-bold text-white block">Final Boss Confrontation</span>
              <span className="text-[10px] text-red-400">Total Goal Mastery Unlocked</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase">
            VICTORY
          </span>
        </div>

      </div>

    </div>
  );
}
