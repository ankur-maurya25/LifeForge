import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getUnreadNotificationsCount,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '../services/api';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout } = useAuth();

  const fetchNotifSummary = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getUnreadNotificationsCount(token);
      if (res && res.success && typeof res.count === 'number') {
        setUnreadNotifCount(res.count);
      }
    } catch (err) {
      // Quiet fail in navbar
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchNotifSummary();
      const interval = setInterval(fetchNotifSummary, 30000); // 30s poll
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, fetchNotifSummary]);

  // Fetch recent notifications when dropdown opened
  const toggleNotifDropdown = async () => {
    if (!isNotifOpen && token) {
      setIsNotifOpen(true);
      setLoadingNotifs(true);
      try {
        const res = await getNotifications(token, { limit: 4 });
        if (res && res.success) {
          setRecentNotifs(res.data || []);
          if (typeof res.unreadCount === 'number') {
            setUnreadNotifCount(res.unreadCount);
          }
        }
      } catch (err) {
        console.error('Error fetching preview notifications:', err);
      } finally {
        setLoadingNotifs(false);
      }
    } else {
      setIsNotifOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  const handleMarkAllRead = async () => {
    if (!token) return;
    setRecentNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadNotifCount(0);
    try {
      await markAllNotificationsAsRead(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.isRead && token) {
      setRecentNotifs(prev =>
        prev.map(n => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
      setUnreadNotifCount(prev => Math.max(0, prev - 1));
      try {
        await markNotificationAsRead(notif._id, token);
      } catch (e) {
        console.error(e);
      }
    }
    setIsNotifOpen(false);
    if (notif.type === 'quest') navigate('/quests');
    else if (notif.type === 'goal') navigate(notif.relatedId ? `/goal/${notif.relatedId}` : '/dashboard');
    else if (notif.type === 'boss') navigate('/bosses');
    else if (notif.type === 'challenge') navigate('/daily-challenge');
    else if (notif.type === 'friend') navigate('/friends');
    else if (notif.type === 'achievement') navigate('/achievements');
    else navigate('/notifications');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-24">
          
          {/* Brand Logo matching reference image style: † LifeForge */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group focus-visible:outline-none"
            aria-label="LifeForge Home"
          >
            <span className="text-2xl sm:text-3xl text-red-600 font-serif leading-none select-none transition-transform group-hover:scale-110">
              †
            </span>
            <span className="font-rpg text-2xl sm:text-3xl font-bold tracking-wider text-red-600 hover:text-red-500 transition-colors drop-shadow-[0_2px_12px_rgba(220,38,38,0.5)]">
              LifeForge
            </span>
          </Link>

          {/* Center Minimal Navigation Links (matching reference layout) */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide text-slate-300">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              World
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              Classes
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              Quests
            </button>
            <Link
              to="/leaderboard"
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              Leaderboard
            </Link>
            <Link
              to="/friends"
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              Party
            </Link>
            <Link
              to="/achievements"
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>🏆</span>
              <span>Feats</span>
            </Link>
            <Link
              to="/ai-coach"
              className="hover:text-purple-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>🔮</span>
              <span>AI Coach</span>
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>⚡</span>
                <span>Admin</span>
              </Link>
            )}
            <Link
              to="/help"
              className="hover:text-purple-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>❓</span>
              <span>Help</span>
            </Link>
          </nav>

          {/* Right Sleek Dark Bordered CTA / User Profile & Logout */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                
                {/* NOTIFICATIONS BELL & DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleNotifDropdown}
                    className="relative p-2 rounded-xl border border-slate-800 hover:border-purple-500/50 bg-black/40 hover:bg-purple-950/20 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    title="Notifications"
                    aria-label="Notifications"
                  >
                    <span className="text-base leading-none">🔔</span>
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 min-w-[18px] h-[18px] rounded-full bg-red-600 border border-red-400 text-white font-mono font-bold text-[10px] flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.7)]">
                        {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0B0D14] border border-[#1E2538] shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
                      {/* Dropdown Header */}
                      <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-black/40">
                        <div className="flex items-center gap-2">
                          <span className="font-rpg font-bold text-sm text-white">Notifications</span>
                          {unreadNotifCount > 0 && (
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40">
                              {unreadNotifCount} New
                            </span>
                          )}
                        </div>

                        {unreadNotifCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] font-mono text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Dropdown Items List */}
                      <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                        {loadingNotifs ? (
                          <div className="p-6 text-center text-xs font-mono text-slate-400">
                            Loading notifications...
                          </div>
                        ) : recentNotifs.length === 0 ? (
                          <div className="p-6 text-center text-xs font-mono text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          recentNotifs.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => handleItemClick(n)}
                              className={`p-3 hover:bg-white/[0.04] transition-colors cursor-pointer flex items-start gap-3 ${
                                !n.isRead ? 'bg-purple-950/20' : ''
                              }`}
                            >
                              <span className="text-base shrink-0 mt-0.5">
                                {n.type === 'quest' ? '⚔️' : n.type === 'goal' ? '🎯' : n.type === 'challenge' ? '⚡' : n.type === 'boss' ? '🐉' : n.type === 'friend' ? '👥' : '📢'}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <p className={`text-xs font-bold font-rpg truncate ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                                    {n.title}
                                  </p>
                                  {!n.isRead && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 font-mono line-clamp-1 mt-0.5">
                                  {n.message}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="p-2.5 bg-black/60 border-t border-white/10 text-center">
                        <Link
                          to="/notifications"
                          onClick={() => setIsNotifOpen(false)}
                          className="text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 transition-colors inline-block"
                        >
                          View All Notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/character"
                  className="flex items-center gap-2 px-3 py-1.5 rounded border border-purple-500/40 bg-purple-950/30 text-xs font-mono text-purple-300 hover:text-white transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {user?.avatar || user?.name?.slice(0, 2).toUpperCase() || 'AM'}
                  </span>
                  <span>{user?.name || 'Adventurer'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-4 py-2 rounded border border-red-800/60 bg-black/50 hover:bg-red-950/40 hover:border-red-500 text-xs font-semibold text-slate-300 hover:text-red-400 transition-all font-mono uppercase cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded border border-red-800/80 bg-black/50 hover:bg-red-950/40 hover:border-red-500 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all tracking-wider uppercase font-mono shadow-sm"
              >
                Enter Realm
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#07080D]/95 border-b border-red-900/40 px-6 pt-4 pb-6 space-y-3 backdrop-blur-xl">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-base text-slate-300 hover:text-red-400"
          >
            World
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-base text-slate-300 hover:text-red-400"
          >
            Classes
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-base text-slate-300 hover:text-red-400"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-base text-slate-300 hover:text-red-400"
          >
            Quests
          </button>
          <Link
            to="/leaderboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-base text-slate-300 hover:text-red-400"
          >
            Leaderboard
          </Link>
          <Link
            to="/friends"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-base text-slate-300 hover:text-purple-400"
          >
            Friends & Party
          </Link>
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-base text-amber-400 hover:text-amber-300"
          >
            ⚡ Admin Dashboard
          </Link>
          <Link
            to="/notifications"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-base text-purple-400 hover:text-purple-300"
          >
            <span>🔔 Notifications</span>
            {unreadNotifCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-red-600 text-white">
                {unreadNotifCount}
              </span>
            )}
          </Link>
          <Link
            to="/help"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-base text-purple-400 hover:text-purple-300"
          >
            ❓ Help & FAQ
          </Link>
          <div className="pt-3 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 py-2 text-sm text-purple-300 font-mono">
                  <span>Adventurer:</span>
                  <span className="font-bold text-white">{user?.name || 'Hero'}</span>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="block w-full text-center py-2.5 rounded border border-red-800 bg-red-950/50 text-sm font-semibold text-red-300 hover:text-white uppercase tracking-wider font-mono cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded border border-red-700 bg-red-950/50 text-sm font-semibold text-white uppercase tracking-wider font-mono"
              >
                Enter Realm
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
