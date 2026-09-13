import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationSummary from '../components/notifications/NotificationSummary';
import NotificationItem from '../components/notifications/NotificationItem';
import NotificationTimeline from '../components/notifications/NotificationTimeline';
import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications
} from '../services/api';

export default function NotificationsPage() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bannerNotice, setBannerNotice] = useState(null);
  const [filter, setFilter] = useState('All');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [listRes, countRes] = await Promise.all([
        getNotifications(token).catch((err) => ({ success: false, message: err.message })),
        getUnreadNotificationsCount(token).catch(() => ({ success: false, count: 0 }))
      ]);

      if (listRes && listRes.success) {
        setNotifications(listRes.data || []);
        if (typeof listRes.unreadCount === 'number') {
          setUnreadCount(listRes.unreadCount);
        } else if (countRes && typeof countRes.count === 'number') {
          setUnreadCount(countRes.count);
        }
      } else {
        setError(listRes?.message || 'Unable to load notifications from server.');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('An unexpected error occurred while loading notifications.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Filter tabs
  const filterTabs = ['All', 'Unread', 'Quests', 'Goals', 'Challenges', 'Bosses', 'Friends', 'Achievements'];

  // Filter logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'All') return true;
      if (filter === 'Unread') return !n.isRead;
      if (filter === 'Quests') return n.type === 'quest';
      if (filter === 'Goals') return n.type === 'goal';
      if (filter === 'Challenges') return n.type === 'challenge';
      if (filter === 'Bosses') return n.type === 'boss';
      if (filter === 'Friends') return n.type === 'friend';
      if (filter === 'Achievements') return n.type === 'achievement';
      return true;
    });
  }, [notifications, filter]);

  // Action: Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!token) return;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    setBannerNotice('✓ All notifications marked as read.');
    setTimeout(() => setBannerNotice(null), 3500);

    try {
      await markAllNotificationsAsRead(token);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      fetchNotifications();
    }
  };

  // Action: Mark single as read
  const handleMarkAsRead = async (id) => {
    if (!token || !id) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(id, token);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      fetchNotifications();
    }
  };

  // Action: Dismiss / delete single notification
  const handleDismiss = async (id) => {
    if (!token || !id) return;

    const target = notifications.find((n) => (n._id === id || n.id === id));
    // Optimistic remove
    setNotifications((prev) => prev.filter((n) => (n._id !== id && n.id !== id)));
    if (target && !target.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    setBannerNotice('Notification removed.');
    setTimeout(() => setBannerNotice(null), 3000);

    try {
      await deleteNotification(id, token);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      fetchNotifications();
    }
  };

  // Action: Clear all notifications
  const handleClearAll = async () => {
    if (!token) return;

    setIsClearing(true);
    try {
      await clearAllNotifications(token);
      setNotifications([]);
      setUnreadCount(0);
      setShowClearConfirm(false);
      setBannerNotice('All notifications cleared.');
      setTimeout(() => setBannerNotice(null), 3500);
    } catch (err) {
      console.error('Failed to clear all notifications:', err);
      setBannerNotice('Failed to clear notifications. Please retry.');
      setTimeout(() => setBannerNotice(null), 3500);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 font-sans pb-24">
      {/* 1. TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
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
                <span className="text-purple-400 text-sm">🔔</span>
                <h1 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide">
                  NOTIFICATIONS
                </h1>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-500/40 animate-pulse">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Realm combat updates, companion invitations, and achievement dispatches
              </p>
            </div>
          </div>

          {/* Navigation & Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/dashboard"
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Dashboard</span>
            </Link>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 py-1.5 rounded-xl font-bold font-mono text-xs text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-purple/20 border border-purple-500/40 cursor-pointer"
              >
                Mark all as read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-1.5 rounded-xl font-mono text-xs text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-950/30 border border-slate-800 hover:border-red-900/40 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Banner Notice */}
        {bannerNotice && (
          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs font-mono text-purple-200 flex items-center gap-2 animate-in fade-in duration-200">
            <span>✨</span>
            <span>{bannerNotice}</span>
          </div>
        )}

        {/* Backend Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={fetchNotifications}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs transition-colors cursor-pointer shrink-0"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* 1. NOTIFICATION SUMMARY CARDS */}
        <NotificationSummary
          unreadCount={unreadCount}
          xpEarnedToday={notifications.filter(n => n.type === 'quest' && n.isRead).length * 40}
          newAchievementsCount={notifications.filter(n => n.type === 'achievement').length}
          currentStreak={user?.streak || 0}
        />

        {/* 2. FILTER CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#0E111A] border border-[#1E2538] shadow-xl">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {filterTabs.map((tab) => {
              const isActive = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold shadow-glow-crimson'
                      : 'bg-[#080A10] border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
            Showing {filteredNotifications.length} of {notifications.length} {notifications.length === 1 ? 'alert' : 'alerts'}
          </span>
        </div>

        {/* 3. NOTIFICATION LIST / LOADING / EMPTY STATE */}
        <section className="space-y-3">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 mx-auto border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-slate-400">
                Retrieving realm transmissions & combat dispatches...
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-[#0E111A] border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-2xl relative overflow-hidden my-6">
              <div className="w-16 h-16 rounded-2xl bg-[#141824] border border-slate-700/60 flex items-center justify-center mx-auto mb-4 text-3xl">
                🔔
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-rpg text-white mb-1.5">
                {filter === 'All' ? 'No notifications yet' : `No ${filter} notifications`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                {filter === 'All'
                  ? 'You are all caught up! Complete quests, forge goals, or invite friends to generate realm dispatches.'
                  : `No notifications match the filter "${filter}". Try selecting "All".`}
              </p>
              {filter !== 'All' && (
                <button
                  onClick={() => setFilter('All')}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-mono text-amber-300 bg-amber-950/30 border border-amber-500/30 hover:bg-amber-950/60 transition-colors"
                >
                  Show All Notifications
                </button>
              )}
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <NotificationItem
                key={n._id || n.id}
                notification={n}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismiss}
              />
            ))
          )}
        </section>

        {/* 4. ACTIVITY TIMELINE */}
        <NotificationTimeline
          activities={notifications.slice(0, 5).map((n) => ({
            id: n._id || n.id,
            icon: n.type === 'quest' ? '⚔️' : n.type === 'goal' ? '🎯' : n.type === 'challenge' ? '⚡' : n.type === 'boss' ? '🐉' : n.type === 'friend' ? '👥' : '🏆',
            title: n.title,
            description: n.message,
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            badge: n.type.toUpperCase(),
            badgeColor: n.isRead ? 'text-slate-400 bg-slate-900/60 border-slate-800' : 'text-purple-300 bg-purple-950/40 border-purple-500/30'
          }))}
        />
      </main>

      {/* CLEAR ALL CONFIRMATION MODAL */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0E111A] border border-red-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-rpg font-bold text-lg text-white">
                Clear All Notifications?
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              This action will permanently purge all {notifications.length} notification alerts from your record ledger. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isClearing}
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isClearing}
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-red-600 hover:bg-red-500 transition-colors cursor-pointer flex items-center gap-2"
              >
                {isClearing ? 'Clearing...' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
