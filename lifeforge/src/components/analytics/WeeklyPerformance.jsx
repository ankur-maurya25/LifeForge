import React from 'react';

export default function WeeklyPerformance({
  dailyActivity = [],
  currentStreak = 0,
  longestStreak = 0,
  consistencyScore = null
}) {
  const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDateStr = new Date().toISOString().split('T')[0];

  const days = dailyActivity.length > 0
    ? dailyActivity.map((d) => {
        const isToday = d.date === todayDateStr;
        const count = d.completedCount || 0;
        let status = 'idle';
        let icon = '💤';

        if (count >= 3) {
          status = 'bonus';
          icon = '👑';
        } else if (count > 0) {
          status = 'completed';
          icon = '⚡';
        } else if (isToday) {
          status = 'today';
          icon = '⏳';
        }

        return {
          day: d.day,
          date: d.date,
          count,
          status,
          icon,
          label: `${d.day}: ${count} Quests Cleared`
        };
      })
    : defaultDays.map((day) => ({
        day,
        count: 0,
        status: 'idle',
        icon: '💤',
        label: `${day}: 0 Quests`
      }));

  const activeDays = days.filter((d) => d.count > 0).length;
  const calculatedConsistency = Math.round((activeDays / 7) * 100);
  const displayScore = consistencyScore !== null ? consistencyScore : calculatedConsistency;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📅</span>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide">
            7-Day Activity Rhythm
          </h3>
        </div>
        <span className="text-xs font-semibold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          {displayScore}% Cadence ({activeDays}/7 active days)
        </span>
      </div>
      <p className="text-xs text-neutral-400 mb-6 font-mono">
        Daily quest completion rhythm showing active days, power surges, and streak momentum.
      </p>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((item, idx) => {
          let style = 'border-white/10 bg-white/5 text-neutral-400';
          let badge = 'text-neutral-400';

          if (item.status === 'completed') {
            style = 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]';
            badge = 'text-emerald-400';
          } else if (item.status === 'bonus') {
            style = 'border-amber-500/50 bg-gradient-to-b from-amber-950/40 to-orange-950/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
            badge = 'text-amber-400';
          } else if (item.status === 'today') {
            style = 'border-purple-500/60 bg-purple-950/40 text-purple-300 ring-2 ring-purple-500/30';
            badge = 'text-purple-400';
          }

          return (
            <div
              key={`${item.day}-${idx}`}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 hover:scale-105 group ${style}`}
              title={item.label}
            >
              <span className="text-xs font-bold text-white mb-1.5 font-mono">{item.day}</span>
              <span className="text-base sm:text-lg mb-1">{item.icon}</span>
              <span className={`text-[10px] font-mono capitalize ${badge}`}>
                {item.count > 0 ? `${item.count} done` : item.status === 'today' ? 'Today' : 'Rest'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend & Streak summary */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Power Surge (3+ quests)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Active Today</span>
          </div>
        </div>

        <div className="text-neutral-300">
          Current Streak: <span className="text-red-400 font-bold">🔥 {currentStreak} Days</span> (Best: {longestStreak}d)
        </div>
      </div>
    </div>
  );
}
