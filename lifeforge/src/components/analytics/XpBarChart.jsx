import React from 'react';

export default function XpBarChart({
  activeFilter = 'This Week',
  dailyXp = [],
  xpEarnedLast7Days = 0,
  xpEarnedLast30Days = 0,
  peakXp = 0,
  totalXp = 0
}) {
  // Fallback default 7-day structure if no daily data provided yet
  const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = dailyXp.length > 0
    ? dailyXp
    : defaultDays.map(day => ({ day, xp: 0, date: '' }));

  const maxVal = Math.max(...chartData.map((item) => item.xp || 0), 100);
  const totalDisplayXp =
    activeFilter === 'This Week'
      ? xpEarnedLast7Days
      : activeFilter === 'This Month'
      ? xpEarnedLast30Days
      : totalXp;

  // Find peak day object
  const peakItem = chartData.reduce(
    (max, cur) => ((cur.xp || 0) > (max.xp || 0) ? cur : max),
    chartData[0] || { day: 'None', xp: 0 }
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">
              XP Progression ({activeFilter})
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {activeFilter === 'This Week' ? 'Weekly gain: ' : activeFilter === 'This Month' ? 'Monthly gain: ' : 'Lifetime gain: '}
            <span className="text-amber-400 font-semibold">+{totalDisplayXp.toLocaleString()} XP</span>
            {activeFilter === 'This Week' && (
              <> • Daily average: <span className="text-neutral-300">{Math.round(totalDisplayXp / 7)} XP/day</span></>
            )}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          {peakItem && peakItem.xp > 0
            ? `Peak: ${peakItem.day} (${peakItem.xp} XP)`
            : 'No Peak Yet'}
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-56 w-full pt-6 pb-2 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-white/10">
        {chartData.map((item, idx) => {
          const isPeak = (item.xp || 0) > 0 && item.xp === peakItem.xp;
          const rawHeight = Math.round(((item.xp || 0) / maxVal) * 100);
          const heightPercent = item.xp > 0 ? `${Math.max(8, rawHeight)}%` : '6px';

          return (
            <div key={`${item.day}-${idx}`} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 px-2 py-1 rounded bg-neutral-800 text-[10px] text-amber-300 font-mono border border-neutral-700 pointer-events-none whitespace-nowrap shadow-lg z-10">
                {item.day}: {item.xp || 0} XP
              </div>

              {/* Bar Container */}
              <div className="w-full max-w-[42px] bg-white/5 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5 relative transition-all duration-300 group-hover:bg-white/10">
                <div
                  style={{ height: heightPercent }}
                  className={`w-full rounded-t-md transition-all duration-500 relative ${
                    isPeak
                      ? 'bg-gradient-to-t from-amber-600 via-orange-500 to-red-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                      : item.xp > 0
                      ? 'bg-gradient-to-t from-red-600/70 via-orange-500/80 to-amber-400/80 group-hover:brightness-125'
                      : 'bg-neutral-800'
                  }`}
                >
                  {isPeak && (
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between items-center px-2 pt-3 text-xs text-neutral-400 font-medium font-mono">
        {chartData.map((item, idx) => {
          const isPeak = (item.xp || 0) > 0 && item.xp === peakItem.xp;
          return (
            <div key={`${item.day}-${idx}`} className="flex-1 text-center">
              <span className={isPeak ? 'text-amber-400 font-bold' : ''}>{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
