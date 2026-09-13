import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createGoal } from '../services/api';
import GoalForm from '../components/goal/GoalForm';
import BossSelector from '../components/goal/BossSelector';
import RoadmapPreview from '../components/goal/RoadmapPreview';
import GoalSummary from '../components/goal/GoalSummary';

export default function CreateGoalPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [deadline, setDeadline] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [selectedBossId, setSelectedBossId] = useState('procrastination-king');

  // Feedback & Validation states
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const handleValidateAndSubmit = async (e) => {
    e?.preventDefault();
    setServerError('');
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Goal title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Goal title must be at least 3 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Goal description is required.';
    }

    if (!category) {
      newErrors.category = 'Category is required.';
    }

    if (!difficulty) {
      newErrors.difficulty = 'Difficulty is required.';
    }

    if (!selectedBossId) {
      newErrors.selectedBossId = 'Boss selection is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createGoal(
        {
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          difficulty
        },
        token
      );

      if (response && response.success) {
        // Navigate to dashboard on success
        navigate('/dashboard');
      } else {
        setServerError(response?.message || 'Failed to create goal.');
      }
    } catch (err) {
      setServerError(err.message || 'An unexpected error occurred while creating goal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 font-sans pb-20">
      
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Back Link */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl text-red-600 font-serif leading-none">†</span>
              <span className="font-rpg text-xl font-bold tracking-wider text-red-600 group-hover:text-red-500 transition-colors">
                LifeForge
              </span>
            </Link>

            <span className="text-slate-700">/</span>

            <Link
              to="/dashboard"
              className="text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <span>←</span> Back to Dashboard
            </Link>
          </div>

          {/* Profile Overview */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-bold text-xs font-rpg text-black">
              {user?.avatar || user?.name?.slice(0, 1).toUpperCase() || 'A'}
            </div>
            <span className="text-xs font-mono text-slate-300 hidden sm:block">
              {user?.name || 'Hunter'} (Lv.{user?.level || 1})
            </span>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Page Headings */}
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <span>⚔️ Goal-to-Boss Engine Forge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-rpg tracking-wide text-white">
            CREATE YOUR NEXT BOSS
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base font-normal">
            Every legendary achievement starts with one meaningful goal.
          </p>
        </div>

        {/* Server Error Alert Banner */}
        {serverError && (
          <div 
            role="alert"
            className="mb-8 p-4 rounded-2xl bg-red-950/50 border border-red-500/50 text-red-300 text-sm font-mono flex items-start gap-3 shadow-glow-crimson/20 animate-in fade-in duration-200"
          >
            <span className="text-lg leading-none mt-0.5">⚠️</span>
            <div className="flex-1">
              <strong className="block text-red-200 font-bold mb-0.5">Failed to Forge Goal</strong>
              <p>{serverError}</p>
            </div>
            <button
              onClick={() => setServerError('')}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-COLUMN RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: FORM & BOSS SELECTOR (7 COLS) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 2. Goal Information Card */}
            <GoalForm
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              category={category}
              setCategory={setCategory}
              deadline={deadline}
              setDeadline={setDeadline}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              errors={errors}
              clearError={clearError}
            />

            {/* 3. Boss Customization Card */}
            <BossSelector
              selectedBossId={selectedBossId}
              setSelectedBossId={setSelectedBossId}
              difficulty={difficulty}
            />
          </div>

          {/* RIGHT COLUMN: ROADMAP & SUMMARY CARD (5 COLS) */}
          <div className="lg:col-span-5 space-y-8">
            {/* 4. Goal Breakdown Preview (Quest Roadmap) */}
            <RoadmapPreview goalTitle={title} />

            {/* 5. Goal Summary Card with CTAs */}
            <GoalSummary
              title={title}
              category={category}
              deadline={deadline}
              difficulty={difficulty}
              selectedBossId={selectedBossId}
              onSubmit={handleValidateAndSubmit}
              onCancel={() => navigate('/dashboard')}
              isSubmitting={isSubmitting}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
