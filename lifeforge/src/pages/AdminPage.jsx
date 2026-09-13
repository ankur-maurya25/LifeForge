import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  getAdminOverview,
  getAdminUsers,
  updateAdminUserStatus,
  getAdminAchievements,
  createAdminAchievement,
  updateAdminAchievement,
  deleteAdminAchievement,
  getAdminGoals,
  getAdminQuests
} from '../services/api';

export default function AdminPage() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview', 'Users', 'Achievements', 'Quests', 'Goals'
  
  // Overview state
  const [overview, setOverview] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalGoals: 0,
    completedGoals: 0,
    totalQuests: 0,
    completedQuests: 0,
    totalXpEarned: 0,
    totalAchievementsUnlocked: 0,
    totalAchievementsCatalog: 0,
    totalBossesDefeated: 0,
    totalChallengesCompleted: 0
  });

  // Users state
  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Achievements state
  const [achievements, setAchievements] = useState([]);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [achievementFormData, setAchievementFormData] = useState({
    title: '',
    description: '',
    icon: '🏆',
    category: 'quest',
    requirementType: 'completed_quests',
    requirementValue: 1,
    xpReward: 100,
    isActive: true
  });

  // Goals & Quests state
  const [goals, setGoals] = useState([]);
  const [quests, setQuests] = useState([]);

  // UI status
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [viewingUser, setViewingUser] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'info' });
    }, 4000);
  };

  // 1. Fetch Overview Stats
  const fetchOverviewData = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getAdminOverview(token);
      if (res && res.success && res.data) {
        setOverview(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin overview:', err);
    }
  }, [token]);

  // 2. Fetch Users
  const fetchUsersData = useCallback(async (page = 1) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getAdminUsers(token, {
        page,
        limit: 10,
        search: searchQuery,
        status: statusFilter,
        role: roleFilter
      });
      if (res && res.success) {
        setUsers(res.data || []);
        if (res.pagination) {
          setUsersPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
      showToast('Failed to load users list.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, searchQuery, statusFilter, roleFilter]);

  // 3. Fetch Achievements Catalog
  const fetchAchievementsData = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getAdminAchievements(token);
      if (res && res.success) {
        setAchievements(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching achievements catalog:', err);
    }
  }, [token]);

  // 4. Fetch Goals & Quests
  const fetchGoalsAndQuests = useCallback(async () => {
    if (!token) return;
    try {
      const [goalsRes, questsRes] = await Promise.all([
        getAdminGoals(token).catch(() => null),
        getAdminQuests(token).catch(() => null)
      ]);
      if (goalsRes && goalsRes.success) setGoals(goalsRes.data || []);
      if (questsRes && questsRes.success) setQuests(questsRes.data || []);
    } catch (err) {
      console.error('Error fetching goals/quests:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchOverviewData();
    fetchUsersData(1);
    fetchAchievementsData();
    fetchGoalsAndQuests();
  }, [fetchOverviewData, fetchUsersData, fetchAchievementsData, fetchGoalsAndQuests]);

  // Handle User Status toggle (Active/Inactive)
  const handleToggleUserStatus = async (targetUser) => {
    if (!token) return;
    if (targetUser._id === user?._id || targetUser.id === user?._id) {
      showToast('You cannot deactivate your own admin account.', 'error');
      return;
    }

    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await updateAdminUserStatus(targetUser._id || targetUser.id, { status: newStatus }, token);
      if (res && res.success) {
        showToast(`User status updated to ${newStatus}.`, 'success');
        fetchUsersData(usersPagination.page);
        fetchOverviewData();
      } else {
        showToast(res?.message || 'Failed to update user status.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating user status.', 'error');
    }
  };

  // Handle User Role toggle (User/Admin)
  const handleToggleUserRole = async (targetUser) => {
    if (!token) return;
    if (targetUser._id === user?._id || targetUser.id === user?._id) {
      showToast('You cannot alter your own admin role.', 'error');
      return;
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await updateAdminUserStatus(targetUser._id || targetUser.id, { role: newRole }, token);
      if (res && res.success) {
        showToast(`User role changed to ${newRole}.`, 'success');
        fetchUsersData(usersPagination.page);
      } else {
        showToast(res?.message || 'Failed to update user role.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating user role.', 'error');
    }
  };

  // Open Achievement Modal for Create/Edit
  const handleOpenAchievementModal = (ach = null) => {
    if (ach) {
      setEditingAchievement(ach);
      setAchievementFormData({
        title: ach.title || '',
        description: ach.description || '',
        icon: ach.icon || '🏆',
        category: ach.category || 'quest',
        requirementType: ach.requirementType || 'completed_quests',
        requirementValue: ach.requirementValue || 1,
        xpReward: ach.xpReward || 100,
        isActive: ach.isActive !== undefined ? ach.isActive : true
      });
    } else {
      setEditingAchievement(null);
      setAchievementFormData({
        title: '',
        description: '',
        icon: '🏆',
        category: 'quest',
        requirementType: 'completed_quests',
        requirementValue: 1,
        xpReward: 100,
        isActive: true
      });
    }
    setIsAchievementModalOpen(true);
  };

  // Save Achievement (Create or Update)
  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingAchievement) {
        const res = await updateAdminAchievement(editingAchievement._id, achievementFormData, token);
        if (res && res.success) {
          showToast('Achievement updated successfully.', 'success');
          setIsAchievementModalOpen(false);
          fetchAchievementsData();
          fetchOverviewData();
        } else {
          showToast(res?.message || 'Failed to update achievement.', 'error');
        }
      } else {
        const res = await createAdminAchievement(achievementFormData, token);
        if (res && res.success) {
          showToast('Achievement created successfully.', 'success');
          setIsAchievementModalOpen(false);
          fetchAchievementsData();
          fetchOverviewData();
        } else {
          showToast(res?.message || 'Failed to create achievement.', 'error');
        }
      }
    } catch (err) {
      showToast(err.message || 'Error saving achievement.', 'error');
    }
  };

  // Delete Achievement
  const handleDeleteAchievement = async (ach) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete achievement "${ach.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await deleteAdminAchievement(ach._id, token);
      if (res && res.success) {
        showToast('Achievement deleted successfully.', 'success');
        fetchAchievementsData();
        fetchOverviewData();
      } else {
        showToast(res?.message || 'Failed to delete achievement.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error deleting achievement.', 'error');
    }
  };

  // Toggle Active State of Achievement
  const handleToggleAchievementActive = async (ach) => {
    if (!token) return;
    try {
      const res = await updateAdminAchievement(ach._id, { isActive: !ach.isActive }, token);
      if (res && res.success) {
        showToast(`Achievement "${ach.title}" is now ${!ach.isActive ? 'Active' : 'Deactivated'}.`, 'success');
        fetchAchievementsData();
      }
    } catch (err) {
      showToast('Failed to toggle achievement status.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-20 relative overflow-hidden">
      <Navbar />

      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Alert Banner */}
      {toast.message && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs font-mono animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/50 text-red-200'
              : toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-purple-950/90 border-purple-500/50 text-purple-200'
          }`}
        >
          <span>{toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✓' : 'ℹ️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <Link to="/dashboard" className="hover:text-amber-300 transition-colors">
                Command Center
              </Link>
              <span>/</span>
              <span className="text-slate-400">High Citadel Admin</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-rpg tracking-wider text-white flex items-center gap-3">
              <span className="text-amber-400">⚡</span>
              <span>ADMIN CITADEL CONSOLE</span>
            </h1>
            <p className="text-sm font-mono text-slate-400 mt-1">
              Manage realm adventurers, supervise quest systems, and regulate achievement catalogs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
              <span>👑</span>
              <span>Admin: {user?.name || user?.username}</span>
            </span>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-[#0F131D] hover:bg-[#161C2B] border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              ← Realm
            </Link>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-blue-500/30 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Users</div>
            <div className="text-2xl font-black font-rpg text-blue-400">{overview.totalUsers}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">{overview.activeUsers} Active</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-amber-500/30 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Quests</div>
            <div className="text-2xl font-black font-rpg text-amber-400">{overview.totalQuests}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">{overview.completedQuests} Cleared</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-red-500/30 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Bosses / Goals</div>
            <div className="text-2xl font-black font-rpg text-red-400">{overview.totalGoals}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">{overview.totalBossesDefeated} Vanquished</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-purple-500/30 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Catalog Feats</div>
            <div className="text-2xl font-black font-rpg text-purple-300">{overview.totalAchievementsCatalog}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">{overview.totalAchievementsUnlocked} Unlocked</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-emerald-500/30 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Realm Total XP</div>
            <div className="text-2xl font-black font-rpg text-emerald-400">{overview.totalXpEarned.toLocaleString()}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">XP Earned</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0F17] border border-amber-500/30 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Daily Bounties</div>
            <div className="text-2xl font-black font-rpg text-amber-300">{overview.totalChallengesCompleted}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Completed</div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'Overview', label: 'Overview', icon: '📊' },
              { id: 'Users', label: `Users (${usersPagination.total || users.length})`, icon: '👤' },
              { id: 'Achievements', label: `Achievements (${achievements.length})`, icon: '🏆' },
              { id: 'Quests', label: `Quests (${quests.length})`, icon: '⚔️' },
              { id: 'Goals', label: `Campaigns (${goals.length})`, icon: '📜' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-black shadow-glow-gold/30'
                    : 'bg-[#111622] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'Achievements' && (
            <button
              onClick={() => handleOpenAchievementModal(null)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-rpg font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Create Feat</span>
            </button>
          )}
        </div>

        {/* TAB 1: OVERVIEW COMPREHENSIVE VIEW */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0C0F17] border border-[#1E2538] shadow-xl space-y-4">
              <h3 className="text-base font-bold font-rpg text-white flex items-center gap-2">
                <span>🛡️ Realm Administration Directives</span>
              </h3>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                As a Citadel Administrator, you possess governance over adventurers and game balancing rules. You can inspect player XP progress, regulate user account statuses, and tune achievement trophy payouts.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/5 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Database Engine:</span>
                  <span className="text-emerald-400 font-bold">MongoDB Online</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Total Registered Heroes:</span>
                  <span className="text-white font-bold">{overview.totalUsers}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Active Campaign Bosses:</span>
                  <span className="text-white font-bold">{overview.totalGoals}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Active Quest Registry:</span>
                  <span className="text-white font-bold">{overview.totalQuests}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C0F17] border border-[#1E2538] shadow-xl space-y-4">
              <h3 className="text-base font-bold font-rpg text-white flex items-center gap-2">
                <span>⚡ Quick Management Actions</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('Users')}
                  className="p-4 rounded-xl bg-[#111622] hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-xl mb-1">👤</div>
                  <div className="text-xs font-bold font-rpg text-white">Manage Users</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">Inspect & toggle accounts</div>
                </button>

                <button
                  onClick={() => setActiveTab('Achievements')}
                  className="p-4 rounded-xl bg-[#111622] hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-xl mb-1">🏆</div>
                  <div className="text-xs font-bold font-rpg text-white">Feats Catalog</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">Tune XP & requirements</div>
                </button>

                <button
                  onClick={() => setActiveTab('Quests')}
                  className="p-4 rounded-xl bg-[#111622] hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-xl mb-1">⚔️</div>
                  <div className="text-xs font-bold font-rpg text-white">Quests Monitor</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">Track global habit completions</div>
                </button>

                <button
                  onClick={() => setActiveTab('Goals')}
                  className="p-4 rounded-xl bg-[#111622] hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-xl mb-1">📜</div>
                  <div className="text-xs font-bold font-rpg text-white">Campaign Bosses</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">Supervise active campaigns</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT TABLE */}
        {activeTab === 'Users' && (
          <div className="rounded-2xl border border-white/10 bg-[#0C0F17] p-5 shadow-xl space-y-4">
            
            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name, username, or email..."
                  className="w-full bg-[#101420] border border-slate-800 focus:border-amber-500/60 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#101420] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-[#101420] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 px-4">Level & XP</th>
                    <th className="pb-3 px-4">Streak</th>
                    <th className="pb-3 px-4">Role</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Joined</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs font-mono text-slate-500">
                        No adventurers found matching the active search.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const isSelf = u._id === user?._id || u.id === user?._id;
                      return (
                        <tr key={u._id || u.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="py-3.5 pr-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-900 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-xs text-amber-400 font-mono shadow-sm">
                              {u.avatar || u.name?.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isSelf && (
                                  <span className="text-[9px] font-mono px-1.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">You</span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">@{u.username} • {u.email}</div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-purple-500/15 text-purple-300 border border-purple-500/25">
                              Lv.{u.level || 1}
                            </span>
                            <span className="text-amber-400 font-mono ml-2">{u.xp || 0} XP</span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            🔥 {u.streak || 0}d
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleUserRole(u)}
                              disabled={isSelf}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                                u.role === 'admin'
                                  ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40 hover:border-amber-400'
                                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {u.role || 'user'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              disabled={isSelf}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border transition-all cursor-pointer ${
                                u.status === 'active'
                                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60'
                                  : 'bg-red-950/60 text-red-400 border-red-500/40 hover:bg-red-900/60'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {u.status === 'active' ? '✓ Active' : '✕ Inactive'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </td>

                          <td className="py-3.5 pl-4 text-right">
                            <button
                              onClick={() => setViewingUser(u)}
                              className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {usersPagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                <span className="text-slate-400">
                  Page {usersPagination.page} of {usersPagination.totalPages} ({usersPagination.total} Total Heroes)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={usersPagination.page <= 1}
                    onClick={() => fetchUsersData(usersPagination.page - 1)}
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 border border-slate-800 cursor-pointer"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={usersPagination.page >= usersPagination.totalPages}
                    onClick={() => fetchUsersData(usersPagination.page + 1)}
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 border border-slate-800 cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACHIEVEMENTS CATALOG MANAGEMENT */}
        {activeTab === 'Achievements' && (
          <div className="rounded-2xl border border-white/10 bg-[#0C0F17] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-rpg text-base font-bold text-white flex items-center gap-2">
                  <span>🏆 Master Achievement Catalog ({achievements.length})</span>
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Create, configure XP yields, requirement formulas, or delete achievements.
                </p>
              </div>

              <button
                onClick={() => handleOpenAchievementModal(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-rpg font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:brightness-110 transition-all cursor-pointer"
              >
                + New Feat
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach._id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    ach.isActive
                      ? 'bg-[#101420] border-amber-500/30'
                      : 'bg-[#090B10] border-slate-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-xl">
                        {ach.icon || '🏆'}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                          ach.isActive
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {ach.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-rpg text-white">{ach.title}</h4>
                    <p className="text-xs font-mono text-slate-400 mt-1 line-clamp-2">{ach.description}</p>
                    
                    <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 uppercase">
                        Cat: {ach.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">
                        Req: {ach.requirementType} ({ach.requirementValue})
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      +{ach.xpReward} XP
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAchievementActive(ach)}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer transition-colors"
                      >
                        {ach.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleOpenAchievementModal(ach)}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAchievement(ach)}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REALM QUESTS LOG */}
        {activeTab === 'Quests' && (
          <div className="rounded-2xl border border-white/10 bg-[#0C0F17] p-5 shadow-xl space-y-4">
            <h3 className="font-rpg text-base font-bold text-white flex items-center gap-2">
              <span>⚔️ Global Quests Registry ({quests.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quests.map((q) => (
                <div key={q._id} className="p-4 rounded-xl bg-[#101420] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                      {q.difficulty}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${q.status === 'completed' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                      {q.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold font-rpg text-white">{q.title}</h4>
                  <p className="text-xs font-mono text-slate-400 line-clamp-2">{q.description || 'Standard tactical quest.'}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Reward: +{q.xpReward} XP</span>
                    <span>Hero: {q.userId?.name || 'Adventurer'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REALM GOALS LOG */}
        {activeTab === 'Goals' && (
          <div className="rounded-2xl border border-white/10 bg-[#0C0F17] p-5 shadow-xl space-y-4">
            <h3 className="font-rpg text-base font-bold text-white flex items-center gap-2">
              <span>📜 Global Campaign Goals ({goals.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((g) => (
                <div key={g._id} className="p-4 rounded-xl bg-[#101420] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
                      {g.category || 'General'}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      {g.progress || 0}% Cleared
                    </span>
                  </div>
                  <h4 className="text-sm font-bold font-rpg text-white">{g.title}</h4>
                  <p className="text-xs font-mono text-slate-400 line-clamp-2">{g.description || 'Campaign boss objective.'}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Creator: {g.user?.name || 'Hero'}</span>
                    <span className="capitalize">{g.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* INSPECT USER MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-purple-500/40 bg-[#0C0F17] p-6 shadow-2xl space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-rpg text-base font-bold text-white flex items-center gap-2">
                <span>👤 Hero Inspector</span>
              </h3>
              <button
                onClick={() => setViewingUser(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Name:</span>
                <span className="text-white font-bold">{viewingUser.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Username:</span>
                <span className="text-purple-300 font-bold">@{viewingUser.username}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-300">{viewingUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Level:</span>
                <span className="text-amber-400 font-bold">Level {viewingUser.level || 1}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Total XP:</span>
                <span className="text-amber-400 font-bold">{viewingUser.xp || 0} XP</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Current Streak:</span>
                <span className="text-red-400 font-bold">🔥 {viewingUser.streak || 0} Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Account Role:</span>
                <span className="text-purple-300 font-bold uppercase">{viewingUser.role || 'user'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Account Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{viewingUser.status || 'active'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Joined Realm:</span>
                <span className="text-slate-300">{viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ACHIEVEMENT MODAL */}
      {isAchievementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/40 bg-[#0C0F17] p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-rpg text-base font-bold text-white flex items-center gap-2">
                <span>🏆</span>
                <span>{editingAchievement ? 'Edit Achievement' : 'Create New Feat'}</span>
              </h3>
              <button
                onClick={() => setIsAchievementModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAchievement} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={achievementFormData.title}
                    onChange={(e) => setAchievementFormData({ ...achievementFormData, title: e.target.value })}
                    placeholder="e.g. Master of Focus"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#101420] border border-slate-800 text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-300 mb-1">Icon (Emoji) *</label>
                  <input
                    type="text"
                    required
                    value={achievementFormData.icon}
                    onChange={(e) => setAchievementFormData({ ...achievementFormData, icon: e.target.value })}
                    placeholder="🏆"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#101420] border border-slate-800 text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={achievementFormData.description}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, description: e.target.value })}
                  placeholder="Explain what the hero must accomplish..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101420] border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category *</label>
                  <select
                    value={achievementFormData.category}
                    onChange={(e) => setAchievementFormData({ ...achievementFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#101420] border border-slate-800 text-white focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="quest">Quest</option>
                    <option value="goal">Goal</option>
                    <option value="boss">Boss</option>
                    <option value="streak">Streak</option>
                    <option value="xp">XP</option>
                    <option value="challenge">Challenge</option>
                    <option value="social">Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Requirement Type *</label>
                  <select
                    value={achievementFormData.requirementType}
                    onChange={(e) => setAchievementFormData({ ...achievementFormData, requirementType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#101420] border border-slate-800 text-white focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="completed_quests">Completed Quests</option>
                    <option value="created_goals">Created Goals</option>
                    <option value="completed_goals">Completed Goals</option>
                    <option value="streak_days">Streak Days</option>
                    <option value="total_xp">Total XP</option>
                    <option value="defeated_bosses">Defeated Bosses</option>
                    <option value="completed_challenges">Completed Challenges</option>
                    <option value="friends_count">Friends Count</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Required Value *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={achievementFormData.requirementValue}
                    onChange={(e) => setAchievementFormData({ ...achievementFormData, requirementValue: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#101420] border border-slate-800 text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">XP Reward *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={achievementFormData.xpReward}
                    onChange={(e) => setAchievementFormData({ ...achievementFormData, xpReward: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#101420] border border-slate-800 text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={achievementFormData.isActive}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, isActive: e.target.checked })}
                  className="rounded border-slate-800 bg-black text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isActiveCheck" className="text-slate-300 text-xs cursor-pointer">
                  Activate achievement immediately in realm catalog
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAchievementModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-glow-gold hover:brightness-110 cursor-pointer font-rpg uppercase"
                >
                  {editingAchievement ? 'Save Changes' : 'Create Feat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
