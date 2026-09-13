import React from 'react';

export default function AppearanceCard({
  selectedTheme,
  onSelectTheme
}) {
  const options = [
    {
      id: 'dark',
      name: 'Dark Realm',
      tag: 'Default Active',
      description: 'Charcoal black canvas with crimson combat embers and gold victory highlights.',
      accentPreview: 'bg-red-600',
      borderPreview: 'border-red-500/50',
      glowPreview: 'from-red-600 to-amber-500'
    },
    {
      id: 'purple',
      name: 'Void Purple',
      tag: 'Accent Variant',
      description: 'Cosmic shadow canvas bathed in ethereal violet runic energy.',
      accentPreview: 'bg-purple-600',
      borderPreview: 'border-purple-500/50',
      glowPreview: 'from-purple-600 to-indigo-500'
    },
    {
      id: 'blue',
      name: 'Cyber Mana',
      tag: 'Accent Variant',
      description: 'Obsidian tactical grid reinforced by electric cyan conduits.',
      accentPreview: 'bg-cyan-500',
      borderPreview: 'border-cyan-500/50',
      glowPreview: 'from-cyan-500 to-blue-500'
    }
  ];

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-bold font-rpg text-white flex items-center gap-2">
          <span>APPEARANCE & VISUAL ACCENT</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30">
            Themes
          </span>
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Select visual aura and energy highlights (demo preview options)
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((option) => {
          const isSelected = selectedTheme === option.id;

          return (
            <div
              key={option.id}
              onClick={() => onSelectTheme(option.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden select-none group ${
                isSelected
                  ? `bg-[#131622] ${option.borderPreview} shadow-xl ring-1 ring-white/10`
                  : 'bg-[#07080E] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Color Swatch & Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full bg-gradient-to-br ${option.glowPreview} shadow-md`}
                    />
                    <span className="text-xs font-bold font-rpg text-white">
                      {option.name}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                      ✓ Active
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 font-mono leading-relaxed mb-4">
                  {option.description}
                </p>
              </div>

              {/* Tag footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">{option.tag}</span>
                <span className={isSelected ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {isSelected ? 'Selected' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
