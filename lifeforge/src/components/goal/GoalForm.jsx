import React from 'react';

const CATEGORIES = [
  'Coding',
  'Study',
  'Fitness',
  'Personal Growth',
  'Career',
  'Other'
];

const DIFFICULTIES = [
  { id: 'Easy', label: 'Easy', color: 'border-emerald-500/40 text-emerald-400', hpBonus: '500 HP Boss' },
  { id: 'Medium', label: 'Medium', color: 'border-blue-500/40 text-blue-400', hpBonus: '1,000 HP Boss' },
  { id: 'Hard', label: 'Hard', color: 'border-amber-500/40 text-amber-400', hpBonus: '2,000 HP Boss' },
  { id: 'Epic', label: 'Epic', color: 'border-red-500/40 text-red-400', hpBonus: '3,500 HP Boss' },
];

export default function GoalForm({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  deadline,
  setDeadline,
  difficulty,
  setDifficulty,
  errors,
  clearError
}) {
  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 sm:p-7 shadow-xl">
      
      <div className="mb-6">
        <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
          Campaign Parameters
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-rpg text-white mt-2">
          What do you want to achieve?
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Define your target clearly so the engine can generate accurate milestones.
        </p>
      </div>

      <div className="space-y-5">
        
        {/* Goal Title */}
        <div>
          <label 
            htmlFor="goal-title"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5"
          >
            Goal Title <span className="text-red-500">*</span>
          </label>
          <input
            id="goal-title"
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) clearError('title');
            }}
            placeholder="Build my first full-stack project"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            className={`w-full bg-[#141824] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
              errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#1E2538] focus:border-red-500 focus:ring-red-500'
            }`}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-xs text-red-400 font-mono flex items-center gap-1">
              <span>⚠</span> {errors.title}
            </p>
          )}
        </div>

        {/* Goal Description */}
        <div>
          <label 
            htmlFor="goal-desc"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5"
          >
            Goal Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="goal-desc"
            rows={3}
            required
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) clearError('description');
            }}
            placeholder="Describe what success looks like and why conquering this boss matters to you…"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "desc-error" : undefined}
            className={`w-full bg-[#141824] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all resize-none ${
              errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#1E2538] focus:border-red-500 focus:ring-red-500'
            }`}
          />
          {errors.description && (
            <p id="desc-error" className="mt-1 text-xs text-red-400 font-mono flex items-center gap-1">
              <span>⚠</span> {errors.description}
            </p>
          )}
        </div>

        {/* Row: Category & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Category Select */}
          <div>
            <label 
              htmlFor="goal-category"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="goal-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) clearError('category');
              }}
              className="w-full bg-[#141824] border border-[#1E2538] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0E111A] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Deadline Date Picker */}
          <div>
            <label 
              htmlFor="goal-deadline"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5"
            >
              Deadline Date <span className="text-red-500">*</span>
            </label>
            <input
              id="goal-deadline"
              type="date"
              required
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                if (errors.deadline) clearError('deadline');
              }}
              aria-invalid={!!errors.deadline}
              aria-describedby={errors.deadline ? "deadline-error" : undefined}
              className={`w-full bg-[#141824] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.deadline ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#1E2538] focus:border-red-500 focus:ring-red-500'
              }`}
            />
            {errors.deadline && (
              <p id="deadline-error" className="mt-1 text-xs text-red-400 font-mono flex items-center gap-1">
                <span>⚠</span> {errors.deadline}
              </p>
            )}
          </div>

        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-2">
            Challenge Difficulty <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DIFFICULTIES.map((diff) => {
              const isSelected = difficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => {
                    setDifficulty(diff.id);
                    if (errors.difficulty) clearError('difficulty');
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#181D2C] border-amber-500 shadow-glow-gold/20 ring-1 ring-amber-500 text-white'
                      : 'bg-[#141824] border-[#1E2538] hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold font-mono uppercase">
                    {diff.label}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                    {diff.hpBonus}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
