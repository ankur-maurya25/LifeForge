import React from 'react';

export default function SkillTree({ skills, onAdvanceSkill, onUnlockSkill }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
            <span>RPG SKILL TREE</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
              Mastery Perks
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Active abilities that amplify quest rewards and weaken procrastination bosses
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Unlocked</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>In Progress</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            <span>Locked</span>
          </span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {skills.map((skill) => {
          const isUnlocked = skill.status === 'unlocked';
          const isInProgress = skill.status === 'in_progress';
          const isLocked = skill.status === 'locked';

          return (
            <div
              key={skill.id}
              className={`rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-xl ${
                isUnlocked
                  ? 'bg-[#0A1312] border-emerald-500/40 hover:border-emerald-400/60'
                  : isInProgress
                  ? 'bg-[#101322] border-amber-500/40 hover:border-amber-400/60'
                  : 'bg-[#0B0D14]/70 border-slate-800/80 opacity-75 hover:opacity-90'
              }`}
            >
              {/* Subtle ambient light per state */}
              {isUnlocked && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              )}
              {isInProgress && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              )}

              <div>
                {/* Top: Icon & Status Badge */}
                <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl border ${
                      isUnlocked
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-glow-gold/10'
                        : isInProgress
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {skill.icon}
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isUnlocked ? (
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                        <span>✓</span> UNLOCKED
                      </span>
                    ) : isInProgress ? (
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-950/70 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                        <span>⏳</span> IN PROGRESS
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-500 border border-slate-800 flex items-center gap-1">
                        <span>🔒</span> LOCKED
                      </span>
                    )}
                  </div>
                </div>

                {/* Skill Name & Description */}
                <div className="relative z-10 mb-3">
                  <h4
                    className={`text-base font-bold font-rpg tracking-wide ${
                      isUnlocked ? 'text-white' : isInProgress ? 'text-amber-100' : 'text-slate-400'
                    }`}
                  >
                    {skill.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>

              {/* Bottom: Progress / Requirement & Interactive Button */}
              <div className="pt-3 border-t border-slate-800/80 relative z-10 space-y-3">
                
                {/* Progress / Requirement Info */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-slate-400">
                      {isUnlocked
                        ? 'Perk Status'
                        : isInProgress
                        ? 'Unlock Progress'
                        : 'Requirement'}
                    </span>
                    <span
                      className={`font-bold ${
                        isUnlocked
                          ? 'text-emerald-400'
                          : isInProgress
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {isUnlocked
                        ? '100% Mastered'
                        : isInProgress
                        ? `${skill.progress}%`
                        : skill.requirement}
                    </span>
                  </div>

                  {/* Progress Bar (for In Progress or Unlocked) */}
                  {!isLocked && (
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                            : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400'
                        }`}
                        style={{ width: `${skill.progress || 100}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Interactive Action Button */}
                <div>
                  {isInProgress && (
                    <button
                      onClick={() => onAdvanceSkill(skill.id)}
                      className="w-full py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-110 active:scale-95 transition-all shadow-glow-gold/10 border border-amber-400/40 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>⚡</span>
                      <span>Practice Skill (+15% Progress)</span>
                    </button>
                  )}

                  {isLocked && skill.canUnlock && (
                    <button
                      onClick={() => onUnlockSkill(skill.id)}
                      className="w-full py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-700 to-red-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-purple-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>✨</span>
                      <span>Unlock Skill Now</span>
                    </button>
                  )}

                  {isUnlocked && (
                    <div className="text-[11px] font-mono text-emerald-400/90 text-center py-1 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                      ✓ Active Passive Benefit Enabled
                    </div>
                  )}

                  {isLocked && !skill.canUnlock && (
                    <div className="text-[11px] font-mono text-slate-500 text-center py-1 bg-slate-900/40 rounded-lg border border-slate-800">
                      Prerequisite not yet fulfilled
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
