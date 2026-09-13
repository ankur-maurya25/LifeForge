import React from 'react';

export default function UsersTab({ users = [], onViewUser }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>👤</span>
            <span>Registered Adventurers ({users.length})</span>
          </h3>
          <p className="text-xs text-neutral-400">Inspect user progression, levels, and active status.</p>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase text-[11px]">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 px-4">Username</th>
              <th className="pb-3 px-4">Level</th>
              <th className="pb-3 px-4">Total XP</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 pl-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="py-3.5 pr-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center font-bold text-xs text-amber-400 font-mono shadow-sm">
                    {user.avatar || user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">{user.role || 'Adventurer'}</div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-neutral-300">
                  {user.username}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-purple-500/15 text-purple-300 border border-purple-500/25">
                    Lv. {user.level}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-amber-400 font-semibold">
                  {user.xp}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      user.status === 'Active' || user.status === 'Online'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-400 border border-white/5'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'Active' || user.status === 'Online'
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-neutral-500'
                      }`}
                    />
                    {user.status}
                  </span>
                </td>
                <td className="py-3.5 pl-4 text-right">
                  <button
                    onClick={() => onViewUser(user)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-purple-600/20 text-neutral-300 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
