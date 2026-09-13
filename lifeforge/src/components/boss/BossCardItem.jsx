import React from 'react';

export default function BossCardItem({
  boss,
  onViewBoss
}) {
  const {
    id,
    name,
    description,
    difficulty,
    currentHp,
    maxHp,
    damageDealt,
    status,
    icon,
    weakness
  } = boss;

  const hpPercentage = Math.round((currentHp / maxHp) * 100);
  const isActive = status === 'Active';
  const isDefeated = status === 'Defeated';
  const isLocked = status === 'Locked';

  // Status-based styling
  const statusStyles = {
    Active: {
      cardBorder: 'border-red-900/50 hover:border-red-500/60 bg-[#0E111A]',
      statusBadge: 'bg-red-950/70 text-red-400 border-red-500/40',
      iconBox: 'bg-red-950/40 border-red-500/40 text-red-400 shadow-glow-crimson/20',
      barGradient: 'from-red-600 via-red-500 to-amber-500'
    },
    Defeated: {
      cardBorder: 'border-emerald-500/40 hover:border-emerald-400/60 bg-[#091512]/60',
      statusBadge: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/40',
      iconBox: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400',
      barGradient: 'from-emerald-600 to-emerald-400'
    },
    Locked: {
      cardBorder: 'border-slate-800/80 bg-[#0B0D14]/70 opacity-75 hover:opacity-90',
      statusBadge: 'bg-slate-900 text-slate-500 border-slate-800',
      iconBox: 'bg-slate-900 border-slate-800 text-slate-500 grayscale',
      barGradient: 'from-slate-700 to-slate-600'
    }
  };

  const style = statusStyles[status] || statusStyles.Active;

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden group ${style.cardBorder}`}
    >
      {/* Background ambient pulse */}
      {isActive && (
        <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
      )}
      {isDefeated && (
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div>
        {/* Top: Icon, Difficulty & Status */}
        <div className="flex items-center justify-between gap-2.5 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0 transition-transform group-hover:scale-105 ${style.iconBox}`}
            >
              {icon}
            </div>

            <div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  difficulty === 'Epic'
                    ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                    : difficulty === 'Hard'
                    ? 'bg-red-950/60 text-red-300 border-red-500/40'
                    : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                }`}
              >
                {difficulty} Tier
              </span>
            </div>
          </div>

          <span
            className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${style.statusBadge}`}
          >
            {isDefeated ? '✓ DEFEATED' : isActive ? '🔥 ACTIVE' : '🔒 LOCKED'}
          </span>
        </div>

        {/* Boss Name & Description */}
        <div className="mb-4 relative z-10">
          <h4 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide group-hover:text-amber-200 transition-colors">
            {name}
          </h4>
          <p className="text-xs text-slate-400 font-mono mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* HP Bar */}
        <div className="mb-4 relative z-10 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">
              {isDefeated ? 'Conquered Vitality' : 'Current Vitality'}
            </span>
            <span className={`font-bold ${isDefeated ? 'text-emerald-400' : 'text-amber-400'}`}>
              {currentHp} / {maxHp} HP ({hpPercentage}%)
            </span>
          </div>

          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${style.barGradient} transition-all duration-500`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Damage Dealt & View Boss Button */}
      <div className="pt-3.5 border-t border-slate-800/80 relative z-10 flex items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Damage Dealt</span>
          <span className="font-bold text-red-400">
            -{damageDealt.toLocaleString()} HP
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewBoss(boss)}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-slate-900 hover:bg-slate-800 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>View Boss</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
