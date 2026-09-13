import React from 'react';
import { Link } from 'react-router-dom';

const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Just now';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const now = new Date();
  const diffSecs = Math.floor((now - d) / 1000);
  if (diffSecs < 60) return 'Just now';
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDismiss
}) {
  const notifId = notification._id || notification.id;
  const {
    type,
    title,
    message,
    description,
    isRead,
    createdAt,
    time,
    relatedId
  } = notification;

  const displayMessage = message || description || '';
  const displayTime = time || formatTimeAgo(createdAt);

  const typeConfig = {
    quest: {
      icon: '⚔️',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40',
      badge: 'Quest',
      defaultLink: '/quests',
      defaultLabel: 'View Quests'
    },
    goal: {
      icon: '🎯',
      color: 'border-blue-500/30 text-blue-400 bg-blue-950/40',
      badge: 'Campaign',
      defaultLink: relatedId ? `/goal/${relatedId}` : '/dashboard',
      defaultLabel: 'View Goal'
    },
    challenge: {
      icon: '⚡',
      color: 'border-yellow-500/30 text-yellow-400 bg-yellow-950/40',
      badge: 'Challenge',
      defaultLink: '/daily-challenge',
      defaultLabel: 'Daily Bounty'
    },
    boss: {
      icon: '🐉',
      color: 'border-red-500/30 text-red-400 bg-red-950/40',
      badge: 'Boss Battle',
      defaultLink: '/bosses',
      defaultLabel: 'Battle Arena'
    },
    friend: {
      icon: '👥',
      color: 'border-purple-500/30 text-purple-400 bg-purple-950/40',
      badge: 'Party',
      defaultLink: '/friends',
      defaultLabel: 'View Allies'
    },
    achievement: {
      icon: '🏆',
      color: 'border-amber-500/30 text-amber-300 bg-amber-950/40',
      badge: 'Level Up',
      defaultLink: '/character',
      defaultLabel: 'View Profile'
    },
    system: {
      icon: '📢',
      color: 'border-slate-500/30 text-slate-300 bg-slate-900/60',
      badge: 'System',
      defaultLink: null,
      defaultLabel: null
    }
  };

  const config = typeConfig[type] || typeConfig.system;
  const actionLink = notification.actionLink || config.defaultLink;
  const actionLabel = notification.actionLabel || config.defaultLabel;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
        !isRead
          ? 'bg-[#111322] border-purple-500/40 shadow-glow-purple/10'
          : 'bg-[#0A0C14] border-slate-800/80 hover:border-slate-750 opacity-85 hover:opacity-100'
      }`}
    >
      {/* Unread Indicator Bar */}
      {!isRead && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-amber-500" />
      )}

      {/* Left Details */}
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        
        {/* Type Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border shrink-0 ${config.color}`}
        >
          {config.icon}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4
              className={`text-sm font-bold font-rpg tracking-wide ${
                !isRead ? 'text-white' : 'text-slate-300'
              }`}
            >
              {title}
            </h4>

            {/* Type badge */}
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {config.badge}
            </span>

            {/* Unread Pill */}
            {!isRead && (
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            )}
          </div>

          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            {displayMessage}
          </p>

          <span className="text-[11px] font-mono text-slate-500 block mt-1.5">
            {displayTime}
          </span>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        
        {/* Deep Link Action */}
        {actionLabel && actionLink && (
          <Link
            to={actionLink}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-amber-300 hover:text-white bg-amber-950/30 hover:bg-amber-950/60 border border-amber-500/30 transition-colors"
          >
            {actionLabel}
          </Link>
        )}

        {/* Mark As Read Button */}
        {!isRead && (
          <button
            onClick={() => onMarkAsRead(notifId)}
            className="p-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Mark as read"
          >
            ✓
          </button>
        )}

        {/* Dismiss Button */}
        <button
          onClick={() => onDismiss(notifId)}
          className="p-1.5 rounded-lg text-xs font-mono text-slate-500 hover:text-red-400 bg-slate-900 hover:bg-red-950/30 border border-slate-800 hover:border-red-900/40 transition-colors cursor-pointer"
          title="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
