import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createGoal } from '../services/api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Step state: 1 (Welcome), 2 (How It Works), 3 (Character Setup), 4 (Final Ready)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [characterName, setCharacterName] = useState(user?.name || 'Valiant Hero');
  const [mainGoal, setMainGoal] = useState('Master Fullstack Architecture');
  const [goalCategory, setGoalCategory] = useState('Coding');
  const [difficulty, setDifficulty] = useState('Medium');

  // Inline Validation Errors
  const [errors, setErrors] = useState({});

  const categories = ['Study', 'Coding', 'Fitness', 'Career', 'Personal Growth'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const validateStep3 = () => {
    const errs = {};
    if (!characterName.trim()) {
      errs.characterName = 'Character name cannot be empty.';
    }
    if (!mainGoal.trim()) {
      errs.mainGoal = 'Main goal cannot be empty.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 3) {
      if (!validateStep3()) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const stepsList = [
    { num: 1, label: 'Welcome' },
    { num: 2, label: 'How It Works' },
    { num: 3, label: 'Character Setup' },
    { num: 4, label: 'Ready' },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-purple-500/30">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-purple-700/15 via-indigo-600/15 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container Card */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-neutral-900/95 to-neutral-950/95 border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 flex flex-col justify-between">
        
        {/* 4. Progress Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Connecting Bar */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-amber-400 -translate-y-1/2 -z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%` }}
            />

            {stepsList.map((step) => {
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div key={step.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 ${
                      isPassed
                        ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                        : isCurrent
                        ? 'bg-amber-400 text-neutral-950 ring-4 ring-purple-500/30 font-black shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                        : 'bg-neutral-800 text-neutral-400 border border-white/10'
                    }`}
                  >
                    {isPassed ? '✓' : step.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold mt-1.5 hidden sm:block ${
                      isCurrent ? 'text-amber-400 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: WELCOME SCREEN */}
        {currentStep === 1 && (
          <div className="text-center py-4 flex flex-col items-center">
            {/* Character / Avatar Illustration Placeholder */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-1 shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-6 animate-pulse">
              <div className="w-full h-full rounded-3xl bg-neutral-950 flex items-center justify-center text-4xl sm:text-5xl">
                🧙‍♂️
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-wide text-white mb-3">
              Welcome to LifeForge
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-md mx-auto leading-relaxed mb-8">
              Turn your goals into quests. Defeat your obstacles. Become the main character of your real life.
            </p>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-500/30 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Start Your Journey</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* STEP 2: HOW LIFEFORGE WORKS */}
        {currentStep === 2 && (
          <div className="py-2">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                How LifeForge Works
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                The Goal-to-Boss engine converts daily discipline into RPG victories.
              </p>
            </div>

            {/* 3 Simple Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-2xl flex items-center justify-center mx-auto mb-3">
                  🎯
                </div>
                <h3 className="text-sm font-bold text-white">Set Your Goal</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Enter your real-life goal.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-2xl flex items-center justify-center mx-auto mb-3">
                  ⚡
                </div>
                <h3 className="text-sm font-bold text-white">Complete Daily Quests</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Convert your goal into small actionable tasks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all text-center">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-2xl flex items-center justify-center mx-auto mb-3">
                  🐉
                </div>
                <h3 className="text-sm font-bold text-white">Defeat the Boss</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Complete quests to earn XP and damage your boss.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/25 transition-all cursor-pointer"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CHARACTER SETUP */}
        {currentStep === 3 && (
          <div className="py-2">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Forge Your Character
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Establish your adventurer identity and primary real-world objective.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4 mb-6">
              {/* Character Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Character Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => {
                    setCharacterName(e.target.value);
                    if (errors.characterName) setErrors({ ...errors, characterName: '' });
                  }}
                  placeholder="e.g. Ankur, IronKnight"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm focus:outline-none transition-all ${
                    errors.characterName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'
                  }`}
                />
                {errors.characterName && (
                  <p className="text-red-400 text-[11px] font-mono mt-1">
                    ⚠ {errors.characterName}
                  </p>
                )}
              </div>

              {/* Main Goal */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Main Goal <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={mainGoal}
                  onChange={(e) => {
                    setMainGoal(e.target.value);
                    if (errors.mainGoal) setErrors({ ...errors, mainGoal: '' });
                  }}
                  placeholder="e.g. Learn React & Node.js, Run 5K Marathon"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm focus:outline-none transition-all ${
                    errors.mainGoal ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'
                  }`}
                />
                {errors.mainGoal && (
                  <p className="text-red-400 text-[11px] font-mono mt-1">
                    ⚠ {errors.mainGoal}
                  </p>
                )}
              </div>

              {/* Category & Difficulty 2-Col Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Goal Category
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-neutral-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Difficulty Tier
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff} className="bg-neutral-900 text-white">
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/25 transition-all cursor-pointer"
                >
                  Enter LifeForge →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: FINAL SUCCESS SCREEN */}
        {currentStep === 4 && (
          <div className="text-center py-4 flex flex-col items-center">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4 animate-bounce">
              ⚔️
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-white mb-1">
              Your journey begins now!
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mb-6">
              Your character is bound to your primary life quest. Enter the dashboard to accept your first daily tasks.
            </p>

            {/* Profile Overview Card */}
            <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-xs text-neutral-400">Character Name</span>
                <span className="text-sm font-bold text-white font-serif">{characterName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-xs text-neutral-400">Selected Goal</span>
                <span className="text-xs font-semibold text-purple-300 text-right max-w-[240px] truncate">
                  {mainGoal} ({goalCategory} • {difficulty})
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-xs text-neutral-400">Starting Level</span>
                <span className="text-xs font-mono font-bold text-amber-400">Level 1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Starting XP</span>
                <span className="text-xs font-mono font-bold text-emerald-400">0 XP</span>
              </div>
            </div>

            <button
              onClick={async () => {
                if (token && mainGoal.trim()) {
                  try {
                    await createGoal({
                      title: mainGoal.trim(),
                      description: `Primary life campaign initialized during realm onboarding.`,
                      category: goalCategory,
                      difficulty: difficulty
                    }, token);
                  } catch (e) {
                    console.warn('Auto-create onboarding goal:', e.message);
                  }
                }
                navigate('/dashboard');
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:brightness-110 text-neutral-950 shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              Go to Dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
