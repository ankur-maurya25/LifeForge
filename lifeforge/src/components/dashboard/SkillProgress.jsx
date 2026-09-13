import React from 'react';
import { Link } from 'react-router-dom';

const SKILLS = [
  { name: 'Coding', level: 'Lv. 14', percentage: 85, color: 'from-blue-600 to-cyan-400' },
  { name: 'Problem Solving', level: 'Lv. 11', percentage: 70, color: 'from-purple-600 to-purple-400' },
  { name: 'Discipline', level: 'Lv. 13', percentage: 78, color: 'from-amber-600 to-amber-400' },
  { name: 'Communication', level: 'Lv. 09', percentage: 60, color: 'from-emerald-600 to-teal-400' },
];

export default function SkillProgress({ onViewCharacter }) {
  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold font-rpg text-white">
            SKILL PROGRESSION
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Attribute levels unlocked through completed quests
          </p>
        </div>
        <span className="text-xs font-mono text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30">
          4 Attributes
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {SKILLS.map((skill) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-200 font-semibold flex items-center gap-2">
                <span>{skill.name}</span>
                <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                  {skill.level}
                </span>
              </span>
              <span className="text-slate-400">{skill.percentage}%</span>
            </div>

            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-500`}
                style={{ width: `${skill.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/character"
        onClick={onViewCharacter}
        className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:border-purple-500/60 hover:bg-[#141824] text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer font-mono uppercase tracking-wider"
      >
        <span>View Character</span>
        <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>

    </div>
  );
}
