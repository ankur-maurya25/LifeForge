import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  searchUsers
} from '../services/api';
import UserProfileCard from '../components/friends/UserProfileCard';
import FriendSearchCard from '../components/friends/FriendSearchCard';
import FriendRequestsSection from '../components/friends/FriendRequestsSection';
import FriendsList from '../components/friends/FriendsList';

export default function FriendsPage() {
  const { user, token } = useAuth();

  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);

  // Action loading state
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modals & Filters
  const [activeFilter, setActiveFilter] = useState('All Friends');
  const [profileModalFriend, setProfileModalFriend] = useState(null);
  const [friendToRemove, setFriendToRemove] = useState(null);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice('');
    }, 4000);
  };

  // Fetch all friends and pending requests from backend
  const fetchFriendsData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [friendsRes, requestsRes] = await Promise.all([
        getFriends(token).catch((err) => ({ success: false, message: err.message })),
        getFriendRequests(token).catch((err) => ({ success: false, message: err.message }))
      ]);

      if (friendsRes && friendsRes.success) {
        setFriends(friendsRes.data || []);
      } else {
        setError(friendsRes?.message || 'Unable to load friends list.');
      }

      if (requestsRes && requestsRes.success && requestsRes.data) {
        setIncomingRequests(requestsRes.data.incoming || []);
        setOutgoingRequests(requestsRes.data.outgoing || []);
      }
    } catch (err) {
      console.error('Error fetching friends data:', err);
      setError('Backend database is currently offline or unreachable.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFriendsData();
  }, [fetchFriendsData]);

  // Handle User Search
  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      setSearchResults([]);
      return;
    }

    if (!token) return;

    setSearchLoading(true);
    try {
      const res = await searchUsers(query, token);
      if (res && res.success) {
        setSearchResults(res.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Send Friend Request
  const handleSendRequest = async (targetUserId) => {
    if (!token) return;
    setSendingId(targetUserId);

    try {
      const res = await sendFriendRequest(targetUserId, token);
      if (res && res.success) {
        showNotice(res.message || 'Friend request sent!');
        // Update local search results relationship
        setSearchResults((prev) =>
          prev.map((u) => (u._id === targetUserId ? { ...u, relationship: 'pending_sent' } : u))
        );
        fetchFriendsData();
      } else {
        showNotice(`⚠️ ${res?.message || 'Failed to send friend request.'}`);
      }
    } catch (err) {
      showNotice(`⚠️ ${err.message || 'Failed to send request.'}`);
    } finally {
      setSendingId(null);
    }
  };

  // Accept Friend Request
  const handleAcceptRequest = async (requestId) => {
    if (!token) return;
    setActionLoadingId(requestId);

    try {
      const res = await acceptFriendRequest(requestId, token);
      if (res && res.success) {
        showNotice(res.message || 'Friend request accepted! You are now friends.');
        fetchFriendsData();
      } else {
        showNotice(`⚠️ ${res?.message || 'Failed to accept request.'}`);
      }
    } catch (err) {
      showNotice(`⚠️ ${err.message || 'Failed to accept request.'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject Friend Request
  const handleRejectRequest = async (requestId) => {
    if (!token) return;
    setActionLoadingId(requestId);

    try {
      const res = await rejectFriendRequest(requestId, token);
      if (res && res.success) {
        showNotice('Friend request rejected.');
        fetchFriendsData();
      } else {
        showNotice(`⚠️ ${res?.message || 'Failed to reject request.'}`);
      }
    } catch (err) {
      showNotice(`⚠️ ${err.message || 'Failed to reject request.'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Remove Friend with Confirmation
  const confirmRemoveFriend = async () => {
    if (!friendToRemove || !token) return;

    try {
      const res = await removeFriend(friendToRemove._id, token);
      if (res && res.success) {
        showNotice(`Removed ${friendToRemove.name || friendToRemove.username} from friends.`);
        setFriendToRemove(null);
        fetchFriendsData();
      } else {
        showNotice(`⚠️ ${res?.message || 'Failed to remove friend.'}`);
      }
    } catch (err) {
      showNotice(`⚠️ ${err.message || 'Failed to remove friend.'}`);
    }
  };

  // Filter & Sort friends list
  const filteredFriends = useMemo(() => {
    const list = [...friends];
    if (activeFilter === 'Highest Level') {
      return list.sort((a, b) => (b.level || 0) - (a.level || 0));
    }
    if (activeFilter === 'Top XP') {
      return list.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    }
    if (activeFilter === 'Longest Streak') {
      return list.sort((a, b) => (b.streak || 0) - (a.streak || 0));
    }
    return list;
  }, [friends, activeFilter]);

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-purple-500/30">
      <Navbar />

      {/* Floating Notice Toast */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-neutral-900 border border-purple-500/40 text-purple-300 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <span className="text-base">✨</span>
          <span>{notice}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-purple-400 font-medium">Friends & Social Realm</span>
        </div>

        {/* 1. Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide bg-gradient-to-r from-white via-neutral-100 to-purple-300 bg-clip-text text-transparent">
                  Friends & Social Realm
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/40">
                  {friends.length} {friends.length === 1 ? 'Ally' : 'Allies'}
                </span>
                {incomingRequests.length > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 animate-pulse">
                    ⚡ {incomingRequests.length} New Requests
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                Forge alliances, compare quest accomplishments, and grow together
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/leaderboard"
              className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <span>🏆</span>
              <span>Hall of Glory</span>
            </Link>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={fetchFriendsData}
              className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs hover:bg-slate-800 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* 2. Top Grid: User Profile Card & Search Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* User Profile Card (5 Cols) */}
          <div className="lg:col-span-5">
            <UserProfileCard
              user={user}
              friendsCount={friends.length}
            />
          </div>

          {/* Search & Invite Card (7 Cols) */}
          <div className="lg:col-span-7">
            <FriendSearchCard
              onSearch={handleSearch}
              searchResults={searchResults}
              searchLoading={searchLoading}
              onSendRequest={handleSendRequest}
              onAcceptRequest={handleAcceptRequest}
              sendingId={sendingId}
            />
          </div>

        </div>

        {/* 3. Pending Friend Invocations (Incoming & Outgoing Requests) */}
        <FriendRequestsSection
          incoming={incomingRequests}
          outgoing={outgoingRequests}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
          actionLoadingId={actionLoadingId}
        />

        {/* 4. Filters Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 flex-wrap">
            {['All Friends', 'Highest Level', 'Top XP', 'Longest Streak'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-purple-600 text-white shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <span className="text-xs text-neutral-400 font-mono">
            Showing {filteredFriends.length} companions
          </span>
        </div>

        {/* 5. Friends List */}
        <div>
          <FriendsList
            friends={filteredFriends}
            loading={loading}
            onRemoveFriend={(friend) => setFriendToRemove(friend)}
            onViewProfile={(friend) => setProfileModalFriend(friend)}
          />
        </div>

      </main>

      {/* Confirmation Modal: Remove Friend */}
      {friendToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl border border-red-500/40 bg-neutral-950 p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 mx-auto flex items-center justify-center text-xl text-red-400">
              ⚠️
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Sever Alliance?
              </h3>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                Are you sure you want to remove <strong className="text-white">{friendToRemove.name}</strong> (@{friendToRemove.username}) from your friends list?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setFriendToRemove(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveFriend}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
              >
                Remove Friend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public Profile Preview Modal */}
      {profileModalFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl border border-purple-500/40 bg-neutral-950 p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-purple-500/40 mx-auto flex items-center justify-center text-2xl font-bold text-amber-400 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              {profileModalFriend.avatar || profileModalFriend.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-serif text-lg font-bold text-white">{profileModalFriend.name}</h3>
            <p className="text-xs font-mono text-purple-300 mt-0.5">@{profileModalFriend.username}</p>

            <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-white/10 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-neutral-400 block text-[10px] uppercase">Level</span>
                <span className="font-bold text-amber-400 font-mono text-sm">Lv. {profileModalFriend.level || 1}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-neutral-400 block text-[10px] uppercase">Total XP</span>
                <span className="font-bold text-purple-300 font-mono text-sm">⚡ {(profileModalFriend.xp || 0).toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-neutral-400 block text-[10px] uppercase">Streak</span>
                <span className="font-bold text-red-400 font-mono text-sm">🔥 {profileModalFriend.streak || 0}d</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs font-mono text-neutral-400 mb-4 flex items-center justify-between">
              <span>Quests Completed:</span>
              <span className="text-emerald-400 font-bold">✓ {profileModalFriend.completedQuests || 0}</span>
            </div>

            <button
              onClick={() => setProfileModalFriend(null)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
