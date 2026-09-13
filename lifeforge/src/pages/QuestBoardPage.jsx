import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getQuests,
  createQuest,
  updateQuest,
  completeQuest,
  deleteQuest,
  getGoals
} from '../services/api';
import QuestSummaryCard from '../components/quest/QuestSummaryCard';
import QuestFilters from '../components/quest/QuestFilters';
import QuestCard from '../components/quest/QuestCard';
import QuestFormModal from '../components/quest/QuestFormModal';
import DeleteConfirmationModal from '../components/quest/DeleteConfirmationModal';
import EmptyQuestState from '../components/quest/EmptyQuestState';

export default function QuestBoardPage() {
  const { user, token, updateUser } = useAuth();

  // Quests & Goals State
  const [quests, setQuests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questsError, setQuestsError] = useState('');

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [deletingQuest, setDeletingQuest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Activity Feedback Notice
  const [activityNotice, setActivityNotice] = useState({
    message: '⚔️ Welcome to the Quest Board. Complete quests to strike bosses and earn Hunter XP.',
    type: 'info'
  });

  // Fetch Quests and Goals from Backend
  const fetchQuestsAndGoals = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setQuestsError('');
    try {
      const [questRes, goalRes] = await Promise.all([
        getQuests(token),
        getGoals(token).catch(() => ({ goals: [] }))
      ]);

      if (questRes?.success) {
        setQuests(questRes.quests || []);
      } else {
        setQuestsError('Unable to load quests. Please start the backend.');
      }

      if (goalRes?.success) {
        setGoals(goalRes.goals || []);
      }
    } catch (err) {
      console.error('❌ Error loading quests:', err.message);
      setQuestsError('Unable to load quests. Please start the backend.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQuestsAndGoals();
  }, [fetchQuestsAndGoals]);

  // Calculate Summary Metrics
  const summary = useMemo(() => {
    const total = quests.length;
    const completed = quests.filter((q) => q.status === 'completed').length;
    const pending = quests.filter((q) => q.status !== 'completed').length;
    const totalXp = quests.reduce((acc, q) => acc + (Number(q.xpReward !== undefined ? q.xpReward : q.xp) || 0), 0);
    const streakDays = user?.streak || 1;

    return { total, completed, inProgress: pending, pending, totalXp, streakDays };
  }, [quests, user]);

  // Status counts for filter pills
  const statusCounts = useMemo(() => {
    return {
      all: quests.length,
      pending: quests.filter((q) => q.status !== 'completed').length,
      in_progress: quests.filter((q) => q.status !== 'completed').length,
      completed: quests.filter((q) => q.status === 'completed').length
    };
  }, [quests]);

  // Handle Filtering & Sorting
  const filteredQuests = useMemo(() => {
    return quests
      .filter((q) => {
        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = (q.title || '').toLowerCase().includes(query);
          const matchDesc = (q.description || '').toLowerCase().includes(query);
          const matchCat = (q.category || q.goalId?.category || '').toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        // Status filter
        if (statusFilter === 'pending' && q.status === 'completed') {
          return false;
        }
        if (statusFilter === 'completed' && q.status !== 'completed') {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'all') {
          const cat = q.category || q.goalId?.category || 'General';
          if (cat !== categoryFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          const timeB = new Date(b.createdAt || 0).getTime();
          const timeA = new Date(a.createdAt || 0).getTime();
          return timeB - timeA;
        }
        if (sortBy === 'xp') {
          const xpA = a.xpReward !== undefined ? a.xpReward : (a.xp || 0);
          const xpB = b.xpReward !== undefined ? b.xpReward : (b.xp || 0);
          return xpB - xpA;
        }
        if (sortBy === 'difficulty') {
          const diffWeight = { Hard: 3, Medium: 2, Easy: 1 };
          return (diffWeight[b.difficulty] || 0) - (diffWeight[a.difficulty] || 0);
        }
        if (sortBy === 'deadline') {
          const dateA = a.dueDate || a.deadline;
          const dateB = b.dueDate || b.deadline;
          if (!dateA) return 1;
          if (!dateB) return -1;
          return new Date(dateA) - new Date(dateB);
        }
        return 0;
      });
  }, [quests, searchTerm, statusFilter, categoryFilter, sortBy]);

  const hasActiveFilters =
    searchTerm.trim() !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
  };

  // Actions: Complete Quest & Award XP
  const handleCompleteQuest = async (questId) => {
    try {
      const res = await completeQuest(questId, token);
      if (res?.success) {
        setQuests((prev) =>
          prev.map((q) => (q._id === questId || q.id === questId ? res.quest : q))
        );
        if (res.user && updateUser) {
          updateUser(res.user);
        }
        setActivityNotice({
          message: `⚔️ ${res.message || 'Quest completed! XP awarded.'}`,
          type: 'success'
        });
      } else {
        setActivityNotice({
          message: res?.message || 'Failed to complete quest.',
          type: 'danger'
        });
      }
    } catch (err) {
      setActivityNotice({
        message: err.message || 'Failed to complete quest.',
        type: 'danger'
      });
    }
  };

  // Actions: Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingQuest(null);
    setModalError('');
    setIsFormModalOpen(true);
  };

  // Actions: Open Edit Modal
  const handleOpenEditModal = (quest) => {
    setEditingQuest(quest);
    setModalError('');
    setIsFormModalOpen(true);
  };

  // Actions: Save Quest (Create or Edit)
  const handleSaveQuest = async (formData) => {
    setIsSubmitting(true);
    setModalError('');
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        xpReward: Number(formData.xp) || 40,
        dueDate: formData.deadline || null,
        goalId: formData.goalId || null
      };

      if (editingQuest) {
        const questId = editingQuest._id || editingQuest.id;
        const res = await updateQuest(questId, payload, token);
        if (res?.success) {
          setQuests((prev) =>
            prev.map((q) => (q._id === questId || q.id === questId ? res.quest : q))
          );
          setActivityNotice({
            message: `✏️ Quest updated: “${res.quest.title}”.`,
            type: 'info'
          });
          setIsFormModalOpen(false);
          setEditingQuest(null);
        } else {
          setModalError(res?.message || 'Failed to update quest.');
        }
      } else {
        const res = await createQuest(payload, token);
        if (res?.success) {
          setQuests((prev) => [res.quest, ...prev]);
          setActivityNotice({
            message: `⚔️ Quest forged: “${res.quest.title}” (+${res.quest.xpReward} XP).`,
            type: 'success'
          });
          setIsFormModalOpen(false);
        } else {
          setModalError(res?.message || 'Failed to create quest.');
        }
      }
    } catch (err) {
      setModalError(err.message || 'Failed to save quest.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actions: Open Delete Modal
  const handleOpenDeleteModal = (quest) => {
    setDeletingQuest(quest);
  };

  // Actions: Confirm Abandon / Delete
  const handleConfirmDelete = async () => {
    if (!deletingQuest) return;
    const questId = deletingQuest._id || deletingQuest.id;
    try {
      const res = await deleteQuest(questId, token);
      if (res?.success) {
        setQuests((prev) => prev.filter((q) => q._id !== questId && q.id !== questId));
        setActivityNotice({
          message: `🗑️ Quest abandoned: “${deletingQuest.title}”.`,
          type: 'danger'
        });
      } else {
        setActivityNotice({
          message: res?.message || 'Failed to delete quest.',
          type: 'danger'
        });
      }
    } catch (err) {
      setActivityNotice({
        message: err.message || 'Failed to delete quest.',
        type: 'danger'
      });
    } finally {
      setDeletingQuest(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 font-sans pb-16">
      
      {/* 1. TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Page Title */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl text-red-600 font-serif leading-none">†</span>
              <span className="font-rpg text-xl font-bold tracking-wider text-red-600 group-hover:text-red-500 transition-colors">
                LifeForge
              </span>
            </Link>

            <div className="hidden sm:block h-6 w-px bg-slate-800" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-sm">📋</span>
                <h1 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide">
                  QUEST BOARD
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Small actions. Real progress. Bigger victories.
              </p>
            </div>
          </div>

          {/* Navigation & Action Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </Link>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl font-bold font-rpg text-xs text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/40 flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span>
              <span>Create New Quest</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Local Demo State Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-[#0E111A] border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                activityNotice.type === 'success'
                  ? 'bg-emerald-400'
                  : activityNotice.type === 'danger'
                  ? 'bg-red-500'
                  : 'bg-amber-400'
              } animate-pulse shrink-0`}
            />
            <span className="text-slate-300">{activityNotice.message}</span>
          </div>

          <div className="text-[11px] text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected to LifeForge API</span>
          </div>
        </div>

        {/* Backend Error / Offline Alert */}
        {questsError && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{questsError}</span>
            </div>
            <button
              onClick={fetchQuestsAndGoals}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs cursor-pointer font-mono"
            >
              Retry
            </button>
          </div>
        )}

        {/* 3. QUEST SUMMARY STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <QuestSummaryCard
            label="Total Quests"
            value={summary.total}
            subtext="Campaign registry"
            icon={<span className="text-base sm:text-lg">📜</span>}
            accent="purple"
          />

          <QuestSummaryCard
            label="Completed"
            value={summary.completed}
            subtext={`${Math.round((summary.completed / (summary.total || 1)) * 100)}% clearance rate`}
            icon={<span className="text-base sm:text-lg">✓</span>}
            accent="emerald"
          />

          <QuestSummaryCard
            label="In Progress"
            value={summary.inProgress}
            subtext="Active today"
            icon={<span className="text-base sm:text-lg">⏳</span>}
            accent="blue"
          />

          <QuestSummaryCard
            label="Total XP"
            value={`${summary.totalXp} XP`}
            subtext="Available rewards"
            icon={<span className="text-base sm:text-lg">⚡</span>}
            accent="amber"
          />

          <QuestSummaryCard
            label="Current Streak"
            value={`${summary.streakDays} Days`}
            subtext="Daily momentum"
            icon={<span className="text-base sm:text-lg">🔥</span>}
            accent="crimson"
          />
        </div>

        {/* 4. SEARCH & FILTER CONTROLS */}
        <QuestFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
          selectedCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          statusCounts={statusCounts}
        />

        {/* 5. QUEST LIST OR EMPTY STATE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span>Active Roster</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                {filteredQuests.length} {filteredQuests.length === 1 ? 'Quest' : 'Quests'}
              </span>
            </h2>

            {hasActiveFilters && (
              <span className="text-xs font-mono text-amber-400">
                Filtered view active
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-slate-400 space-y-3">
              <div className="w-10 h-10 mx-auto border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <p>Retrieving your quests from LifeForge Guild database...</p>
            </div>
          ) : filteredQuests.length === 0 ? (
            <EmptyQuestState
              hasFilters={hasActiveFilters}
              onResetFilters={handleClearFilters}
              onCreateQuest={handleOpenCreateModal}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredQuests.map((quest) => (
                <QuestCard
                  key={quest._id || quest.id}
                  quest={quest}
                  onComplete={handleCompleteQuest}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 6. CREATE / EDIT QUEST MODAL */}
      <QuestFormModal
        isOpen={isFormModalOpen}
        isEditing={Boolean(editingQuest)}
        questData={editingQuest}
        goals={goals}
        isSubmitting={isSubmitting}
        serverError={modalError}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingQuest(null);
          setModalError('');
        }}
        onSubmit={handleSaveQuest}
      />

      {/* 7. DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingQuest)}
        quest={deletingQuest}
        onClose={() => setDeletingQuest(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
