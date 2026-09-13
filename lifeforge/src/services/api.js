/**
 * LifeForge API Base Service Configuration
 * Centralized HTTP client wrapper using single base URL: http://localhost:5000/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic Fetch Wrapper with JSON handling & Error Interception
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    let data;
    try {
      data = await response.json();
    } catch {
      data = { message: response.statusText || 'Unexpected server response' };
    }

    if (!response.ok) {
      throw new Error(data.message || `API Error (${response.status})`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Backend server is offline or unreachable. Please verify server is running on port 5000.');
    }
    throw error;
  }
}

/**
 * Health check helper
 */
export async function checkBackendHealth() {
  return apiRequest('/health');
}

/**
 * Register User API call
 * POST /api/auth/register
 */
export async function registerApi(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

/**
 * Login User API call
 * POST /api/auth/login
 */
export async function loginApi(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

/**
 * Get Current User API call
 * GET /api/auth/me (Bearer Token)
 */
export async function getMeApi(token) {
  return apiRequest('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Update Profile API call
 * PUT /api/auth/profile (Bearer Token)
 */
export async function updateProfileApi(profileData, token) {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
}

/**
 * ============================================================================
 * GOAL API SERVICES (Protected with Bearer Token)
 * ============================================================================
 */

/**
 * Create Goal API call
 * POST /api/goals
 */
export async function createGoal(goalData, token) {
  return apiRequest('/goals', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(goalData)
  });
}

/**
 * Get All Goals of Current User
 * GET /api/goals
 */
export async function getGoals(token) {
  return apiRequest('/goals', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Single Goal by ID
 * GET /api/goals/:id
 */
export async function getGoalById(id, token) {
  return apiRequest(`/goals/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Update Goal by ID
 * PUT /api/goals/:id
 */
export async function updateGoal(id, updateData, token) {
  return apiRequest(`/goals/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
}

/**
 * Delete Goal by ID
 * DELETE /api/goals/:id
 */
export async function deleteGoal(id, token) {
  return apiRequest(`/goals/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * ============================================================================
 * QUEST API SERVICES (Protected with Bearer Token)
 * ============================================================================
 */

/**
 * Create a new Quest
 * POST /api/quests
 */
export async function createQuest(questData, token) {
  return apiRequest('/quests', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(questData)
  });
}

/**
 * Get all quests for authenticated user
 * GET /api/quests
 */
export async function getQuests(token, queryParams = {}) {
  const query = new URLSearchParams();
  if (queryParams.status) query.append('status', queryParams.status);
  if (queryParams.goalId) query.append('goalId', queryParams.goalId);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/quests${qs}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get single quest by ID
 * GET /api/quests/:id
 */
export async function getQuestById(id, token) {
  return apiRequest(`/quests/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Update quest
 * PUT /api/quests/:id
 */
export async function updateQuest(id, updateData, token) {
  return apiRequest(`/quests/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
}

/**
 * Complete a quest and award XP
 * PATCH /api/quests/:id/complete
 */
export async function completeQuest(id, token) {
  return apiRequest(`/quests/${id}/complete`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Delete a quest
 * DELETE /api/quests/:id
 */
export async function deleteQuest(id, token) {
  return apiRequest(`/quests/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * ============================================================================
 * DAILY CHALLENGE & STREAK API SERVICES (Protected with Bearer Token)
 * ============================================================================
 */

/**
 * Get Today's Challenge (auto-generates if none exists)
 * GET /api/daily-challenges/today
 */
export async function getTodayChallenge(token) {
  return apiRequest('/daily-challenges/today', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Daily Challenge History
 * GET /api/daily-challenges/history
 */
export async function getChallengeHistory(token) {
  return apiRequest('/daily-challenges/history', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Generate a Daily Challenge for Today
 * POST /api/daily-challenges/generate
 */
export async function generateDailyChallenge(data = {}, token) {
  return apiRequest('/daily-challenges/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
}

/**
 * Complete a Daily Challenge (Updates Streak & awards XP)
 * PATCH /api/daily-challenges/:id/complete
 */
export async function completeDailyChallenge(id, token) {
  return apiRequest(`/daily-challenges/${id}/complete`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * ============================================================================
 * LEADERBOARD API SERVICES (Protected with Bearer Token)
 * ============================================================================
 */

/**
 * Get Leaderboard Rankings
 * GET /api/leaderboard?type=xp&limit=10&page=1
 */
export async function getLeaderboard(params = {}, token) {
  const query = new URLSearchParams();
  if (params.type) query.append('type', params.type);
  if (params.limit) query.append('limit', params.limit);
  if (params.page) query.append('page', params.page);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/leaderboard${qs}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Current User Ranking across all categories
 * GET /api/leaderboard/me
 */
export async function getMyLeaderboardRank(token) {
  return apiRequest('/leaderboard/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Leaderboard General Statistics & Top Hunter
 * GET /api/leaderboard/stats
 */
export async function getLeaderboardStats(token) {
  return apiRequest('/leaderboard/stats', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * ============================================================================
 * FRIENDS & SOCIAL API SERVICES (Protected with Bearer Token)
 * ============================================================================
 */

/**
 * Get Current Friends List
 * GET /api/friends
 */
export async function getFriends(token) {
  return apiRequest('/friends', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Incoming and Outgoing Friend Requests
 * GET /api/friends/requests
 */
export async function getFriendRequests(token) {
  return apiRequest('/friends/requests', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Send a Friend Request
 * POST /api/friends/request/:userId
 */
export async function sendFriendRequest(userId, token) {
  return apiRequest(`/friends/request/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Accept an Incoming Friend Request
 * PATCH /api/friends/request/:requestId/accept
 */
export async function acceptFriendRequest(requestId, token) {
  return apiRequest(`/friends/request/${requestId}/accept`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Reject an Incoming Friend Request
 * PATCH /api/friends/request/:requestId/reject
 */
export async function rejectFriendRequest(requestId, token) {
  return apiRequest(`/friends/request/${requestId}/reject`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Remove an Existing Friend
 * DELETE /api/friends/:userId
 */
export async function removeFriend(userId, token) {
  return apiRequest(`/friends/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Search Users by Name or Username
 * GET /api/friends/search?query=xyz
 */
export async function searchUsers(query, token) {
  const q = encodeURIComponent(query || '');
  return apiRequest(`/friends/search?query=${q}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * ============================================================================
 * ANALYTICS & PROGRESS API SERVICES (Protected with Bearer Token)
 * ============================================================================
 */

/**
 * Get Overview Analytics
 * GET /api/analytics/overview
 */
export async function getAnalyticsOverview(token) {
  return apiRequest('/analytics/overview', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Quest Analytics
 * GET /api/analytics/quests
 */
export async function getQuestAnalytics(token) {
  return apiRequest('/analytics/quests', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Goal Analytics
 * GET /api/analytics/goals
 */
export async function getGoalAnalytics(token) {
  return apiRequest('/analytics/goals', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get XP Analytics
 * GET /api/analytics/xp
 */
export async function getXpAnalytics(token) {
  return apiRequest('/analytics/xp', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Streak Analytics
 * GET /api/analytics/streak
 */
export async function getStreakAnalytics(token) {
  return apiRequest('/analytics/streak', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * ============================================================================
 * NOTIFICATIONS API SERVICES (Protected with Bearer Token)
 * ============================================================================
 */

/**
 * Get Notifications List for Authenticated User
 * GET /api/notifications
 */
export async function getNotifications(token, params = {}) {
  const queryParts = [];
  if (params.type) queryParts.push(`type=${encodeURIComponent(params.type)}`);
  if (params.unreadOnly) queryParts.push(`unreadOnly=${encodeURIComponent(params.unreadOnly)}`);
  if (params.page) queryParts.push(`page=${encodeURIComponent(params.page)}`);
  if (params.limit) queryParts.push(`limit=${encodeURIComponent(params.limit)}`);

  const qs = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  return apiRequest(`/notifications${qs}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Unread Notification Count
 * GET /api/notifications/unread-count
 */
export async function getUnreadNotificationsCount(token) {
  return apiRequest('/notifications/unread-count', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Mark a Notification as Read
 * PATCH /api/notifications/:id/read
 */
export async function markNotificationAsRead(id, token) {
  return apiRequest(`/notifications/${id}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Mark All Notifications as Read
 * PATCH /api/notifications/read-all
 */
export async function markAllNotificationsAsRead(token) {
  return apiRequest('/notifications/read-all', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Delete a Single Notification
 * DELETE /api/notifications/:id
 */
export async function deleteNotification(id, token) {
  return apiRequest(`/notifications/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Clear All Notifications for Current User
 * DELETE /api/notifications/clear-all
 */
export async function clearAllNotifications(token) {
  return apiRequest('/notifications/clear-all', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * ============================================================================
 * ACHIEVEMENTS & LEVEL-UP API SERVICES (Protected with Bearer Token)
 * ============================================================================
 */

/**
 * Get all achievements with real progress, unlocked status, and claim state
 * GET /api/achievements
 */
export async function getAchievements(token, params = {}) {
  const queryParts = [];
  if (params.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
  if (params.status) queryParts.push(`status=${encodeURIComponent(params.status)}`);

  const qs = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  return apiRequest(`/achievements${qs}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get unlocked achievements for logged-in user
 * GET /api/achievements/unlocked
 */
export async function getUnlockedAchievements(token) {
  return apiRequest('/achievements/unlocked', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get overall achievement progress statistics
 * GET /api/achievements/progress
 */
export async function getAchievementProgress(token) {
  return apiRequest('/achievements/progress', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Claim reward for an unlocked achievement
 * POST /api/achievements/:id/claim
 */
export async function claimAchievementReward(id, token) {
  return apiRequest(`/achievements/${id}/claim`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * ============================================================================
 * AI LIFE COACH & RECOMMENDATIONS SERVICES (Protected with Bearer Token)
 * ============================================================================
 */

/**
 * Send a prompt/question to the AI Life Coach
 * POST /api/ai-coach/chat
 */
export async function sendAiCoachMessage(message, token) {
  return apiRequest('/ai-coach/chat', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
}

/**
 * Get real-time smart recommendations from AI Coach
 * GET /api/ai-coach/recommendations
 */
export async function getAiRecommendations(token) {
  return apiRequest('/ai-coach/recommendations', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get AI Coach conversation history
 * GET /api/ai-coach/history
 */
export async function getAiCoachHistory(token, limit = 30) {
  return apiRequest(`/ai-coach/history?limit=${limit}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Clear AI Coach conversation history
 * DELETE /api/ai-coach/history
 */
export async function clearAiCoachHistory(token) {
  return apiRequest('/ai-coach/history', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * ============================================================================
 * ADMIN MANAGEMENT PANEL API SERVICES (Protected with Bearer Token + Admin Role)
 * ============================================================================
 */

/**
 * Get Platform Overview Stats
 * GET /api/admin/overview
 */
export async function getAdminOverview(token) {
  return apiRequest('/admin/overview', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Paginated Users List
 * GET /api/admin/users
 */
export async function getAdminUsers(token, params = {}) {
  const queryParts = [];
  if (params.page) queryParts.push(`page=${encodeURIComponent(params.page)}`);
  if (params.limit) queryParts.push(`limit=${encodeURIComponent(params.limit)}`);
  if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
  if (params.status) queryParts.push(`status=${encodeURIComponent(params.status)}`);
  if (params.role) queryParts.push(`role=${encodeURIComponent(params.role)}`);

  const qs = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  return apiRequest(`/admin/users${qs}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get User Details by ID
 * GET /api/admin/users/:id
 */
export async function getAdminUserById(id, token) {
  return apiRequest(`/admin/users/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Update User Status or Role
 * PATCH /api/admin/users/:id/status
 */
export async function updateAdminUserStatus(id, updateData, token) {
  return apiRequest(`/admin/users/${id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
}

/**
 * Get Realm Goals
 * GET /api/admin/goals
 */
export async function getAdminGoals(token) {
  return apiRequest('/admin/goals', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Realm Quests
 * GET /api/admin/quests
 */
export async function getAdminQuests(token) {
  return apiRequest('/admin/quests', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get Achievement Catalog
 * GET /api/admin/achievements
 */
export async function getAdminAchievements(token) {
  return apiRequest('/admin/achievements', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Create an Achievement
 * POST /api/admin/achievements
 */
export async function createAdminAchievement(achievementData, token) {
  return apiRequest('/admin/achievements', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(achievementData)
  });
}

/**
 * Update an Achievement
 * PUT /api/admin/achievements/:id
 */
export async function updateAdminAchievement(id, updateData, token) {
  return apiRequest(`/admin/achievements/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
}

/**
 * Delete an Achievement
 * DELETE /api/admin/achievements/:id
 */
export async function deleteAdminAchievement(id, token) {
  return apiRequest(`/admin/achievements/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export default {
  API_BASE_URL,
  apiRequest,
  checkBackendHealth,
  registerApi,
  loginApi,
  getMeApi,
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  createQuest,
  getQuests,
  getQuestById,
  updateQuest,
  completeQuest,
  deleteQuest,
  getTodayChallenge,
  getChallengeHistory,
  generateDailyChallenge,
  completeDailyChallenge,
  getLeaderboard,
  getMyLeaderboardRank,
  getLeaderboardStats,
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  getAnalyticsOverview,
  getQuestAnalytics,
  getGoalAnalytics,
  getXpAnalytics,
  getStreakAnalytics,
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getAchievements,
  getUnlockedAchievements,
  getAchievementProgress,
  claimAchievementReward,
  sendAiCoachMessage,
  getAiRecommendations,
  getAiCoachHistory,
  clearAiCoachHistory,
  getAdminOverview,
  getAdminUsers,
  getAdminUserById,
  updateAdminUserStatus,
  getAdminGoals,
  getAdminQuests,
  getAdminAchievements,
  createAdminAchievement,
  updateAdminAchievement,
  deleteAdminAchievement
};






