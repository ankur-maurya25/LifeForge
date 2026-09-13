import React from 'react';

export default function ChallengeMainCard({
  title = 'Build Your Daily Momentum',
  description = 'Execute today’s tactical discipline routine to reinforce habit streaks and blast the daily boss.',
  difficulty = 'Medium',
  xpReward = 150,
  challengeDate,
  completedCount = 0,
  totalCount = 4,
  isChallengeCompleted = false,
  onCompleteChallenge,
  isCompleting = false,
  streak = 0,
  longestStreak = 0
}) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : (isChallengeCompleted ? 100 : 0);

  const difficultyColors = {
    Easy: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    Medium: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    Hard: 'bg-red-950/60 text-red-300 border-red-500/40'
  };

  const badgeColor = difficultyColors[difficulty] || difficultyColors.Medium;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0E111A] border border-[#1E2538] p-6 sm:p-8 shadow-2xl">
      {/* Ambient Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Challenge Title & Badges */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
              {difficulty} Difficulty
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/40">
              Productivity
            </span>
            {challengeDate && (
              <span className="text-xs font-mono text-slate-400">
                📅 {challengeDate}
              </span>
            )}
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-950/60 text-orange-300 border border-orange-500/40 flex items-center gap-1">
              <span>🔥</span> {streak} Day Streak
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-rpg text-white tracking-wide">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            {description}
          </p>
        </div>

        {/* Right: Reward Bounty & Action Button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-[#07080E] border border-slate-800 text-right w-full sm:w-auto">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Clear Reward Bounty
            </span>
            <span className="text-xl font-bold font-mono text-amber-400 flex items-center justify-end gap-1.5 mt-0.5">
              <span>⚡</span> +{xpReward} XP
            </span>
          </div>

          <button
            type="button"
            disabled={isChallengeCompleted || isCompleting}
            onClick={onCompleteChallenge}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold font-rpg text-xs text-white transition-all shadow-xl flex items-center justify-center gap-2 select-none ${
              isChallengeCompleted
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 cursor-not-allowed'
                : isCompleting
                ? 'bg-slate-800 text-slate-400 cursor-wait'
                : 'bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 shadow-glow-crimson border border-red-500/40 cursor-pointer'
            }`}
          >
            {isCompleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>Completing...</span>
              </>
            ) : isChallengeCompleted ? (
              <>
                <span>✓</span>
                <span>Challenge Completed</span>
              </>
            ) : (
              <>
                <span>⚔️</span>
                <span>Complete Challenge</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Bottom: Progress Bar */}
      <div className="mt-6 pt-6 border-t border-slate-800/80 relative z-10 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <span>Progress:</span>
            <span className="text-amber-400 font-bold">
              {completedCount}/{totalCount} tasks completed
            </span>
          </span>

          <span className="font-bold text-slate-200">
            {isChallengeCompleted ? '100% Completed' : `${percentage}% In Progress`}
          </span>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isChallengeCompleted
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-glow-gold/20'
                : 'bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 shadow-glow-crimson/20'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
