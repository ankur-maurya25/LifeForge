import React, { useState, useEffect } from 'react';

export default function QuestFormModal({
  isOpen,
  isEditing = false,
  questData = null,
  goals = [],
  isSubmitting = false,
  serverError = '',
  onClose,
  onSubmit
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Coding',
    difficulty: 'Medium',
    xp: 40,
    damage: 8,
    deadline: '',
    goalId: '',
    relatedGoal: '',
    status: 'pending'
  });

  const [errors, setErrors] = useState({});

  // Populate form when modal opens or questData changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && questData) {
        const rawDeadline = questData.dueDate
          ? new Date(questData.dueDate).toISOString().split('T')[0]
          : (questData.deadline || '');

        setFormData({
          title: questData.title || '',
          description: questData.description || '',
          category: questData.category || questData.goalId?.category || 'Coding',
          difficulty: questData.difficulty || 'Medium',
          xp: questData.xpReward !== undefined ? questData.xpReward : (questData.xp || 40),
          damage: questData.damage || Math.round((questData.xpReward || questData.xp || 40) / 5),
          deadline: rawDeadline,
          goalId: questData.goalId?._id || (typeof questData.goalId === 'string' ? questData.goalId : ''),
          relatedGoal: questData.goalId?.title || questData.relatedGoal || '',
          status: questData.status || 'pending'
        });
      } else {
        // Reset to default new quest
        setFormData({
          title: '',
          description: '',
          category: 'Coding',
          difficulty: 'Medium',
          xp: 40,
          damage: 8,
          deadline: '',
          goalId: goals && goals.length > 0 ? goals[0]._id : '',
          relatedGoal: goals && goals.length > 0 ? goals[0].title : '',
          status: 'pending'
        });
      }
      setErrors({});
    }
  }, [isOpen, isEditing, questData, goals]);

  if (!isOpen) return null;

  const categories = [
    'Coding',
    'Study',
    'Fitness',
    'Personal Growth',
    'Career'
  ];

  const difficultyPresets = {
    Easy: { xp: 25, damage: 5 },
    Medium: { xp: 40, damage: 8 },
    Hard: { xp: 60, damage: 12 },
    Epic: { xp: 100, damage: 20 }
  };

  const handleDifficultyChange = (level) => {
    const preset = difficultyPresets[level] || { xp: 40, damage: 8 };
    setFormData((prev) => ({
      ...prev,
      difficulty: level,
      xp: preset.xp,
      damage: preset.damage
    }));
    if (errors.difficulty) {
      setErrors((prev) => ({ ...prev, difficulty: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Quest title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Quest description is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.difficulty.trim()) {
      newErrors.difficulty = 'Please select a difficulty level';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline date is required';
    } else if (formData.deadline < todayStr) {
      newErrors.deadline = 'Deadline cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      xp: Number(formData.xp) || 25,
      damage: Number(formData.damage) || 5
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#0B0D14] border border-[#1E2538] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-500">⚔️</span>
              <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                {isEditing ? 'REFORGE ACTIVE QUEST' : 'INSCRIBE NEW QUEST'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-rpg text-white">
              {isEditing ? 'Edit Quest Details' : 'Create New Quest'}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Turn today’s objective into a boss-striking action.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-xs">
          {/* Quest Title */}
          <div>
            <label className="block font-mono text-slate-300 font-semibold mb-1">
              Quest Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              placeholder="e.g. Complete frontend UI"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#07080E] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.title
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                  : 'border-slate-800 focus:border-red-500/50 focus:ring-red-500/30'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-red-400 font-mono text-[11px] flex items-center gap-1">
                <span>⚠️</span> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-slate-300 font-semibold mb-1">
              Short Description <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              placeholder="What specific step will you complete?"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#07080E] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all resize-none ${
                errors.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                  : 'border-slate-800 focus:border-red-500/50 focus:ring-red-500/30'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-red-400 font-mono text-[11px] flex items-center gap-1">
                <span>⚠️</span> {errors.description}
              </p>
            )}
          </div>

          {/* Category & Related Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block font-mono text-slate-300 font-semibold mb-1">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (errors.category) setErrors({ ...errors, category: null });
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#07080E] border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500/50 cursor-pointer font-sans"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Related Goal */}
            <div>
              <label className="block font-mono text-slate-300 font-semibold mb-1">
                Linked Campaign Goal
              </label>
              <select
                value={formData.goalId || ''}
                onChange={(e) => {
                  const selectedG = goals.find((g) => g._id === e.target.value);
                  setFormData({
                    ...formData,
                    goalId: e.target.value,
                    relatedGoal: selectedG ? selectedG.title : ''
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#07080E] border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500/50 cursor-pointer font-sans truncate"
              >
                <option value="">-- Independent Quest (No Goal) --</option>
                {goals && goals.map((g) => (
                  <option key={g._id} value={g._id}>
                    🎯 {g.title} ({g.category || 'General'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty Selection Cards */}
          <div>
            <label className="block font-mono text-slate-300 font-semibold mb-1.5">
              Difficulty Tier <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Easy', 'Medium', 'Hard', 'Epic'].map((diff) => {
                const isSelected = formData.difficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => handleDifficultyChange(diff)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500 text-white shadow-glow-crimson font-bold'
                        : 'bg-[#07080E] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-mono text-xs">{diff}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      +{difficultyPresets[diff].xp} XP • -{difficultyPresets[diff].damage} HP
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom XP, Damage & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* XP Reward */}
            <div>
              <label className="block font-mono text-slate-400 mb-1">
                XP Reward (⚡)
              </label>
              <input
                type="number"
                min="5"
                max="500"
                value={formData.xp}
                onChange={(e) => setFormData({ ...formData, xp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#07080E] border border-slate-800 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Boss Damage */}
            <div>
              <label className="block font-mono text-slate-400 mb-1">
                Boss Damage (🔥 HP)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.damage}
                onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#07080E] border border-slate-800 text-red-400 font-mono font-bold focus:outline-none focus:border-red-500/50"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block font-mono text-slate-300 font-semibold mb-1">
                Deadline <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={formData.deadline}
                onChange={(e) => {
                  setFormData({ ...formData, deadline: e.target.value });
                  if (errors.deadline) setErrors({ ...errors, deadline: null });
                }}
                className={`w-full px-3 py-2 rounded-xl bg-[#07080E] border font-mono text-slate-200 focus:outline-none ${
                  errors.deadline ? 'border-red-500' : 'border-slate-800 focus:border-red-500/50'
                }`}
              />
            </div>
          </div>

          {errors.deadline && (
            <p className="text-red-400 font-mono text-[11px] flex items-center gap-1">
              <span>⚠️</span> {errors.deadline}
            </p>
          )}

          {/* If Editing, allow toggling status */}
          {isEditing && (
            <div className="pt-2 border-t border-slate-800/80">
              <label className="block font-mono text-slate-300 font-semibold mb-1">
                Current Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#07080E] border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-red-500/50 cursor-pointer"
              >
                <option value="pending">⚔️ Pending</option>
                <option value="in_progress">⏳ In Progress</option>
                <option value="completed">✓ Completed</option>
              </select>
            </div>
          )}

          {serverError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl font-mono text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-bold font-rpg text-xs text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-600 transition-all shadow-glow-crimson border border-red-500/40 flex items-center gap-2 ${
                isSubmitting
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:brightness-110 active:scale-95 cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                '⚔️ Forge Quest'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
