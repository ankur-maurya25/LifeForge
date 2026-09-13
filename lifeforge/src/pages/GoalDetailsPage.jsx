import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGoalById, updateGoal, getQuests } from '../services/api';
import Navbar from '../components/Navbar';
import EditGoalModal from '../components/goal/EditGoalModal';

export default function GoalDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  // 1. Goal Header State
  const [goal, setGoal] = useState({
    title: 'Become a Full Stack Developer',
    description: 'Decompose modern full-stack web development into actionable daily milestones, mastering React, Node.js, and cloud databases.',
    category: 'Career',
    difficulty: 'Hard',
    createdDate: 'Aug 15, 2026',
    status: 'In Progress',
    estimatedCompletion: 'Nov 30, 2026'
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 2 & 3. Milestones Timeline State
  const [milestones, setMilestones] = useState([
    { id: 1, name: 'Learn HTML & CSS', status: 'Completed', xp: 200, progress: 100 },
    { id: 2, name: 'Master JavaScript', status: 'Completed', xp: 250, progress: 100 },
    { id: 3, name: 'Build React Projects', status: 'Completed', xp: 300, progress: 100 },
    { id: 4, name: 'Learn Backend', status: 'Completed', xp: 350, progress: 100 },
    { id: 5, name: 'Connect Database', status: 'In Progress', xp: 300, progress: 45 },
    { id: 6, name: 'Deploy Full Stack App', status: 'Locked', xp: 400, progress: 0 }
  ]);

  // 4. Related Daily Quests State
  const [quests, setQuests] = useState([
    { id: 1, name: 'Complete JavaScript practice', difficulty: 'Medium', xp: 80, completed: true },
    { id: 2, name: 'Build one React component', difficulty: 'Easy', xp: 50, completed: true },
    { id: 3, name: 'Watch backend tutorial', difficulty: 'Easy', xp: 40, completed: false },
    { id: 4, name: 'Solve 5 coding problems', difficulty: 'Hard', xp: 120, completed: false }
  ]);

  // 5. Connected Boss State
  const [boss, setBoss] = useState({
    name: 'Full Stack Fear',
    currentHp: 320,
    maxHp: 600,
    damageDealt: 280,
    status: 'Active Nemesis'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    if (id && token) {
      getGoalById(id, token)
        .then((res) => {
          if (res?.success && res.goal) {
            const g = res.goal;
            setGoal({
              title: g.title,
              description: g.description || 'No description provided.',
              category: g.category || 'General',
              difficulty: g.difficulty || 'Medium',
              createdDate: new Date(g.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              status: g.status === 'active' ? 'In Progress' : g.status === 'completed' ? 'Completed' : 'Paused',
              estimatedCompletion: 'In Progress'
            });
            if (g.milestones && g.milestones.length > 0) {
              setMilestones(
                g.milestones.map((m, idx) => ({
                  id: m._id || idx + 1,
                  name: m.title,
                  description: m.description,
                  status: m.completed ? 'Completed' : 'In Progress',
                  xp: m.xpReward || 50,
                  progress: m.progress || (m.completed ? 100 : 0)
                }))
              );
            }
          }
        })
        .catch((err) => {
          console.warn('Could not load specific goal from API:', err.message);
        });

      // Load quests linked to this goal
      getQuests(token, { goalId: id })
        .then((qRes) => {
          if (qRes?.success && Array.isArray(qRes.quests) && qRes.quests.length > 0) {
            setQuests(
              qRes.quests.map((q, idx) => ({
                id: q._id || idx + 1,
                name: q.title,
                difficulty: q.difficulty || 'Medium',
                xp: q.xpReward || 50,
                completed: q.status === 'completed'
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [id, token]);

  // Toggle milestone completion
  const handleToggleMilestone = (id) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextCompleted = m.status !== 'Completed';
          return {
            ...m,
            status: nextCompleted ? 'Completed' : 'In Progress',
            progress: nextCompleted ? 100 : 50
          };
        }
        return m;
      })
    );
    showToast('Milestone status updated!');
  };

  // Toggle quest completion
  const handleToggleQuest = (id) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const nextState = !q.completed;
          if (nextState) {
            setBoss((b) => ({
              ...b,
              currentHp: Math.max(0, b.currentHp - 25),
              damageDealt: b.damageDealt + 25
            }));
            showToast(`Quest completed! Dealt -25 DMG to ${boss.name}! 🔥`);
          } else {
            setBoss((b) => ({
              ...b,
              currentHp: Math.min(b.maxHp, b.currentHp + 25),
              damageDealt: Math.max(0, b.damageDealt - 25)
            }));
            showToast('Quest status unchecked.');
          }
          return { ...q, completed: nextState };
        }
        return q;
      })
    );
  };

  // Save Goal Edits
  const handleSaveGoal = async (updatedFields) => {
    setGoal((prev) => ({ ...prev, ...updatedFields }));
    setIsEditModalOpen(false);
    if (id && token) {
      try {
        const res = await updateGoal(id, updatedFields, token);
        if (res?.success) {
          showToast('Goal updated successfully in database!');
          return;
        }
      } catch (err) {
        console.warn('Error saving goal:', err.message);
      }
    }
    showToast('Goal updated.');
  };

  // Calculations
  const completedMilestonesCount = milestones.filter((m) => m.status === 'Completed').length;
  const totalMilestonesCount = milestones.length;
  const overallProgress = totalMilestonesCount === 0
    ? 0
    : Math.round(milestones.reduce((acc, curr) => acc + curr.progress, 0) / totalMilestonesCount);

  const bossHpPercentage = Math.round((boss.currentHp / boss.maxHp) * 100);

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-purple-500/30">
      <Navbar />

      {/* Floating Demo Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-neutral-900 border border-purple-500/40 text-purple-300 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <span className="text-base">✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
          <Link to="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-purple-400 font-medium">Goal Progression Hub</span>
        </div>

        {/* 1. GOAL HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {goal.category}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                {goal.difficulty} Tier
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                ● {goal.status}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Initiated on {goal.createdDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide bg-gradient-to-r from-white via-neutral-100 to-purple-300 bg-clip-text text-transparent">
              {goal.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              {goal.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>✏️</span>
              <span>Edit Goal</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* 2. GOAL PROGRESS CARD */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-neutral-900/90 via-purple-950/20 to-neutral-900/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-mono text-purple-300 font-semibold uppercase">Campaign Mastery</span>
              <h2 className="text-xl font-serif font-bold text-white mt-0.5">Overall Goal Velocity</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">{overallProgress}%</span>
              <span className="text-xs text-neutral-400 block font-mono">Total Completion</span>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="w-full h-3.5 rounded-full bg-neutral-800 border border-white/10 overflow-hidden mb-5">
            <div
              style={{ width: `${overallProgress}%` }}
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">Milestones</span>
              <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                {completedMilestonesCount} / {totalMilestonesCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">Total XP Earned</span>
              <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">
                1,250 XP
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">Current Streak</span>
              <span className="text-sm font-bold text-red-400 font-mono mt-0.5 block">
                🔥 7 days
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">Target Horizon</span>
              <span className="text-xs font-semibold text-neutral-300 font-mono mt-0.5 block">
                {goal.estimatedCompletion}
              </span>
            </div>
          </div>
        </div>

        {/* 3 & 5. TWO-COLUMN LAYOUT: MILESTONES (Left 7) & CONNECTED BOSS (Right 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">
          
          {/* LEFT: 3. MILESTONES TIMELINE (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗺️</span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Milestones Timeline
                </h3>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {completedMilestonesCount}/{totalMilestonesCount} Unlocked
              </span>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => {
                const isCompleted = m.status === 'Completed';
                const isLocked = m.status === 'Locked';

                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-950/15 border-emerald-500/30'
                        : isLocked
                        ? 'bg-white/[0.01] border-white/5 opacity-60'
                        : 'bg-neutral-900/90 border-purple-500/30 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                            isCompleted
                              ? 'bg-emerald-500 text-neutral-950'
                              : isLocked
                              ? 'bg-neutral-800 text-neutral-500'
                              : 'bg-purple-600 text-white'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{m.name}</h4>
                          <span className="text-[10px] font-mono text-amber-400 font-semibold">
                            +{m.xp} XP Reward
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : isLocked
                            ? 'bg-neutral-800 text-neutral-400'
                            : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    {/* Milestone Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden my-3">
                      <div
                        style={{ width: `${m.progress}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-400' : 'bg-purple-500'
                        }`}
                      />
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleToggleMilestone(m.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-200 border-white/10'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: 5. CONNECTED BOSS CARD & 6. REWARDS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Connected Boss Card */}
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-950/20 via-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-red-400 uppercase">
                    CONNECTED BOSS NEMESIS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">
                  Goal-to-Boss Link
                </span>
              </div>

              <div className="flex items-center gap-3 my-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/30 to-black border border-red-500/40 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  👹
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">{boss.name}</h3>
                  <p className="text-xs text-neutral-400">Psychological barrier manifested as an RPG boss.</p>
                </div>
              </div>

              {/* HP Bar */}
              <div className="my-4">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-red-400 font-semibold">Boss Vitality</span>
                  <span className="text-white font-bold">{boss.currentHp} / {boss.maxHp} HP ({bossHpPercentage}%)</span>
                </div>
                <div className="h-3 w-full bg-neutral-900 rounded-full border border-red-500/30 overflow-hidden">
                  <div
                    style={{ width: `${bossHpPercentage}%` }}
                    className="h-full bg-gradient-to-r from-red-700 via-rose-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4 pt-2 border-t border-white/5">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block">Damage Dealt</span>
                  <span className="text-emerald-400 font-bold">-{boss.damageDealt} HP</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block">Remaining HP</span>
                  <span className="text-red-400 font-bold">{boss.currentHp} HP</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/boss-battle')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>⚔️</span>
                <span>Continue Boss Battle</span>
                <span>→</span>
              </button>
            </div>

            {/* 6. REWARDS SECTION */}
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🎁</span>
                <h3 className="font-serif text-base font-bold text-white">Campaign Spoils & Rewards</h3>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                Milestones completed under this goal yield cumulative RPG progression points:
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span>⚡</span>
                    <span>Total Target XP</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">+1,800 XP</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span>🪙</span>
                    <span>Realm Gold / Coins</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-yellow-300">450 Coins</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span>📈</span>
                    <span>Skill Progress</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-purple-300">+25% Coding Mastery</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span>🏆</span>
                    <span>Achievement Unlock</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">Fullstack Knight</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span>🔥</span>
                    <span>Streak Multiplier</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-red-400">+15% Bonus XP</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 4. RELATED DAILY QUESTS */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-6 backdrop-blur-xl shadow-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>📋</span>
                <span>Related Daily Quests ({quests.filter((q) => q.completed).length}/{quests.length} Completed)</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Daily task iterations supporting your primary Full Stack goal. Checking a quest automatically inflicts damage on the boss!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {quests.map((q) => (
              <div
                key={q.id}
                onClick={() => handleToggleQuest(q.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  q.completed
                    ? 'bg-emerald-950/15 border-emerald-500/30 text-neutral-300'
                    : 'bg-white/[0.02] border-white/5 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={q.completed}
                    onChange={() => {}} // Handled by parent div
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-neutral-900 border-white/20 cursor-pointer"
                  />
                  <div>
                    <span className={`text-sm font-semibold transition-colors ${q.completed ? 'line-through text-neutral-400' : 'text-white group-hover:text-purple-300'}`}>
                      {q.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-neutral-300">
                        {q.difficulty}
                      </span>
                      <span className="text-[11px] font-mono text-amber-400 font-semibold">
                        +{q.xp} XP
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    q.completed ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-500'
                  }`}
                >
                  {q.completed ? 'Done ✓' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 7. EDIT GOAL MODAL */}
      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        goal={goal}
        onSave={handleSaveGoal}
      />
    </div>
  );
}
