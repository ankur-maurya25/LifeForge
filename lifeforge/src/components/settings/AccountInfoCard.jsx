import React from 'react';

export default function AccountInfoCard({
  account = {
    accountType: 'Demo User',
    characterName: 'Ankur',
    level: 8,
    questsCompleted: 42,
    accountStatus: 'Active',
    realmServer: 'LifeForge Global Realm (Demo Cluster)',
    joinedDate: 'Sep 01, 2026'
  }
}) {
  const fields = [
    { label: 'Account Type', value: account.accountType, badge: 'Demo Environment', badgeColor: 'text-amber-300 bg-amber-950/40 border-amber-500/30' },
    { label: 'Character Created', value: account.characterName, icon: '⚔️' },
    { label: 'Current Level', value: `Level ${account.level}`, badge: 'Rising Builder', badgeColor: 'text-purple-300 bg-purple-950/40 border-purple-500/30' },
    { label: 'Total Quests Completed', value: account.questsCompleted, icon: '📜' },
    { label: 'Account Status', value: account.accountStatus, badge: '✓ Active', badgeColor: 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30' },
    { label: 'Realm Server', value: account.realmServer, icon: '🌐' }
  ];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white flex items-center gap-2">
            <span>ACCOUNT & REALM METRICS</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              Demo Registry
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Operational details and character registration summary
          </p>
        </div>

        <span className="text-[11px] font-mono text-slate-500 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
          Database: Connecting in Step 2
        </span>
      </div>

      {/* Grid of info items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {fields.map((field) => (
          <div
            key={field.label}
            className="p-4 rounded-2xl bg-[#07080E] border border-slate-800/80 flex flex-col justify-between"
          >
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
              {field.label}
            </span>

            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-sm sm:text-base font-bold font-rpg text-white flex items-center gap-1.5">
                {field.icon && <span>{field.icon}</span>}
                <span>{field.value}</span>
              </span>

              {field.badge && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${field.badgeColor}`}
                >
                  {field.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
