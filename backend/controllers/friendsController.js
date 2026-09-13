const mongoose = require('mongoose');
const User = require('../models/User');
const Quest = require('../models/Quest');
const FriendRequest = require('../models/FriendRequest');
const Friendship = require('../models/Friendship');
const { createNotification } = require('../utils/notificationService');
const { checkAndUnlockAchievements } = require('../utils/achievementService');

/**
 * Check if MongoDB connection is active
 */
const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database is currently offline. Please ensure MongoDB is running or configure MONGO_URI.'
    });
    return false;
  }
  return true;
};

/**
 * Helper to canonicalize two ObjectIds (user1 < user2)
 */
const getCanonicalPair = (idA, idB) => {
  const strA = idA.toString();
  const strB = idB.toString();
  return strA < strB ? [idA, idB] : [idB, idA];
};

/**
 * @desc    Get all friends of the authenticated user
 * @route   GET /api/friends
 * @access  Private (JWT)
 */
const getFriends = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const currentUserId = req.user._id;

    // Find all friendships where current user is user1 or user2
    const friendships = await Friendship.find({
      $or: [{ user1: currentUserId }, { user2: currentUserId }]
    })
      .populate('user1', 'name username avatar level xp streak longestStreak')
      .populate('user2', 'name username avatar level xp streak longestStreak')
      .sort({ createdAt: -1 });

    // Extract friend user object
    const friendsList = [];

    for (const f of friendships) {
      const isUser1 = f.user1 && f.user1._id.toString() === currentUserId.toString();
      const friendObj = isUser1 ? f.user2 : f.user1;

      if (!friendObj) continue;

      // Count completed quests for this friend
      const completedQuests = await Quest.countDocuments({
        userId: friendObj._id,
        status: 'completed'
      });

      friendsList.push({
        _id: friendObj._id,
        friendshipId: f._id,
        name: friendObj.name || friendObj.username,
        username: friendObj.username,
        avatar: friendObj.avatar || (friendObj.name ? friendObj.name.charAt(0).toUpperCase() : 'A'),
        level: friendObj.level || 1,
        xp: friendObj.xp || 0,
        streak: friendObj.streak || 0,
        longestStreak: friendObj.longestStreak || friendObj.streak || 0,
        completedQuests,
        friendsSince: f.createdAt
      });
    }

    return res.status(200).json({
      success: true,
      count: friendsList.length,
      data: friendsList
    });
  } catch (error) {
    console.error('Error fetching friends list:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch friends list',
      error: error.message
    });
  }
};

/**
 * @desc    Get incoming and outgoing pending friend requests
 * @route   GET /api/friends/requests
 * @access  Private (JWT)
 */
const getFriendRequests = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const currentUserId = req.user._id;

    const [incoming, outgoing] = await Promise.all([
      // Requests received by current user
      FriendRequest.find({
        receiverId: currentUserId,
        status: 'pending'
      })
        .populate('senderId', 'name username avatar level xp streak')
        .sort({ createdAt: -1 }),

      // Requests sent by current user
      FriendRequest.find({
        senderId: currentUserId,
        status: 'pending'
      })
        .populate('receiverId', 'name username avatar level xp streak')
        .sort({ createdAt: -1 })
    ]);

    // Format safely
    const formattedIncoming = incoming
      .filter((r) => r.senderId)
      .map((r) => ({
        _id: r._id,
        status: r.status,
        createdAt: r.createdAt,
        user: {
          _id: r.senderId._id,
          name: r.senderId.name,
          username: r.senderId.username,
          avatar: r.senderId.avatar,
          level: r.senderId.level || 1,
          xp: r.senderId.xp || 0,
          streak: r.senderId.streak || 0
        }
      }));

    const formattedOutgoing = outgoing
      .filter((r) => r.receiverId)
      .map((r) => ({
        _id: r._id,
        status: r.status,
        createdAt: r.createdAt,
        user: {
          _id: r.receiverId._id,
          name: r.receiverId.name,
          username: r.receiverId.username,
          avatar: r.receiverId.avatar,
          level: r.receiverId.level || 1,
          xp: r.receiverId.xp || 0,
          streak: r.receiverId.streak || 0
        }
      }));

    return res.status(200).json({
      success: true,
      data: {
        incoming: formattedIncoming,
        outgoing: formattedOutgoing,
        incomingCount: formattedIncoming.length,
        outgoingCount: formattedOutgoing.length
      }
    });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch friend requests',
      error: error.message
    });
  }
};

/**
 * @desc    Send a friend request to another user
 * @route   POST /api/friends/request/:userId
 * @access  Private (JWT)
 */
const sendFriendRequest = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // 1. Validation: valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target user ID format'
      });
    }

    // 2. Validation: cannot send to self
    if (userId.toString() === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a friend request to yourself'
      });
    }

    // 3. Validation: target user must exist
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }

    // 4. Validation: check if already friends
    const [user1, user2] = getCanonicalPair(currentUserId, userId);
    const existingFriendship = await Friendship.findOne({ user1, user2 });
    if (existingFriendship) {
      return res.status(400).json({
        success: false,
        message: `You are already friends with ${targetUser.name || targetUser.username}`
      });
    }

    // 5. Validation: check if a pending request already exists in either direction
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId: currentUserId, receiverId: userId, status: 'pending' },
        { senderId: userId, receiverId: currentUserId, status: 'pending' }
      ]
    });

    if (existingRequest) {
      if (existingRequest.senderId.toString() === currentUserId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Friend request has already been sent and is currently pending'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `${targetUser.name || targetUser.username} has already sent you a request. Check your incoming requests!`
        });
      }
    }

    // 6. Create friend request
    const newRequest = await FriendRequest.create({
      senderId: currentUserId,
      receiverId: userId,
      status: 'pending'
    });

    // Dispatch Friend Request Received Notification to receiver
    createNotification({
      userId: userId,
      type: 'friend',
      title: `New Ally Request from ${req.user.name || 'A Hunter'}`,
      message: `${req.user.name || req.user.username} sent you a companion friend request!`,
      relatedId: newRequest._id
    });

    return res.status(201).json({
      success: true,
      message: `Friend request sent to ${targetUser.name || targetUser.username}`,
      data: {
        _id: newRequest._id,
        receiver: {
          _id: targetUser._id,
          name: targetUser.name,
          username: targetUser.username,
          avatar: targetUser.avatar,
          level: targetUser.level || 1
        },
        status: 'pending',
        createdAt: newRequest.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send friend request',
      error: error.message
    });
  }
};

/**
 * @desc    Accept an incoming friend request
 * @route   PATCH /api/friends/request/:requestId/accept
 * @access  Private (JWT)
 */
const acceptFriendRequest = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid friend request ID format'
      });
    }

    const request = await FriendRequest.findById(requestId).populate(
      'senderId',
      'name username avatar level xp streak'
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Ownership check: only the designated receiver can accept
    if (request.receiverId.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this friend request'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request is already ${request.status}`
      });
    }

    // 1. Mark request as accepted
    request.status = 'accepted';
    await request.save();

    // 2. Form canonical friendship
    const [user1, user2] = getCanonicalPair(request.senderId._id, currentUserId);
    const friendship = await Friendship.findOneAndUpdate(
      { user1, user2 },
      { user1, user2 },
      { upsert: true, new: true }
    );

    // Dispatch Friend Request Accepted Notification to original sender
    createNotification({
      userId: request.senderId._id,
      type: 'friend',
      title: `Ally Request Accepted!`,
      message: `${req.user.name || req.user.username} accepted your friend request. You are now allied companions!`,
      relatedId: friendship._id
    });

    // Check achievement unlock for both friends (1st friend achievement)
    checkAndUnlockAchievements(req.user._id).catch(() => {});
    checkAndUnlockAchievements(request.senderId._id).catch(() => {});

    return res.status(200).json({
      success: true,
      message: `You are now friends with ${request.senderId.name || request.senderId.username}!`,
      data: {
        friendshipId: friendship._id,
        friend: {
          _id: request.senderId._id,
          name: request.senderId.name,
          username: request.senderId.username,
          avatar: request.senderId.avatar,
          level: request.senderId.level || 1,
          xp: request.senderId.xp || 0,
          streak: request.senderId.streak || 0
        }
      }
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to accept friend request',
      error: error.message
    });
  }
};

/**
 * @desc    Reject an incoming friend request
 * @route   PATCH /api/friends/request/:requestId/reject
 * @access  Private (JWT)
 */
const rejectFriendRequest = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid friend request ID format'
      });
    }

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Ownership check: only receiver can reject
    if (request.receiverId.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this friend request'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request is already ${request.status}`
      });
    }

    request.status = 'rejected';
    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Friend request rejected',
      data: {
        requestId: request._id
      }
    });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject friend request',
      error: error.message
    });
  }
};

/**
 * @desc    Remove an existing friend / cancel friendship
 * @route   DELETE /api/friends/:userId
 * @access  Private (JWT)
 */
const removeFriend = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid friend user ID format'
      });
    }

    const [user1, user2] = getCanonicalPair(currentUserId, userId);

    const friendship = await Friendship.findOneAndDelete({ user1, user2 });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: 'Friendship not found'
      });
    }

    // Clean up friend request records between them so they can connect again later
    await FriendRequest.deleteMany({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Friend removed successfully'
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove friend',
      error: error.message
    });
  }
};

/**
 * @desc    Search users by display name or username and attach friendship status
 * @route   GET /api/friends/search?query=
 * @access  Private (JWT)
 */
const searchUsers = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const { query } = req.query;
    const currentUserId = req.user._id;

    if (!query || !query.trim()) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Sanitize search query to prevent regex injection
    const sanitized = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(sanitized, 'i');

    // Find users excluding current user and stripping sensitive data
    const matchedUsers = await User.find({
      $or: [{ username: regex }, { name: regex }],
      _id: { $ne: currentUserId }
    })
      .select('name username avatar level xp streak longestStreak')
      .limit(15);

    if (matchedUsers.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Determine friendship / request relationship for each user
    const userIds = matchedUsers.map((u) => u._id);

    const [friendships, pendingSent, pendingReceived] = await Promise.all([
      Friendship.find({
        $or: [
          { user1: currentUserId, user2: { $in: userIds } },
          { user2: currentUserId, user1: { $in: userIds } }
        ]
      }),
      FriendRequest.find({
        senderId: currentUserId,
        receiverId: { $in: userIds },
        status: 'pending'
      }),
      FriendRequest.find({
        senderId: { $in: userIds },
        receiverId: currentUserId,
        status: 'pending'
      })
    ]);

    const friendIdSet = new Set();
    friendships.forEach((f) => {
      friendIdSet.add(f.user1.toString() === currentUserId.toString() ? f.user2.toString() : f.user1.toString());
    });

    const pendingSentMap = new Map();
    pendingSent.forEach((r) => pendingSentMap.set(r.receiverId.toString(), r._id));

    const pendingReceivedMap = new Map();
    pendingReceived.forEach((r) => pendingReceivedMap.set(r.senderId.toString(), r._id));

    const results = await Promise.all(
      matchedUsers.map(async (u) => {
        const uIdStr = u._id.toString();
        let relationship = 'none';
        let requestId = null;

        if (friendIdSet.has(uIdStr)) {
          relationship = 'friends';
        } else if (pendingSentMap.has(uIdStr)) {
          relationship = 'pending_sent';
          requestId = pendingSentMap.get(uIdStr);
        } else if (pendingReceivedMap.has(uIdStr)) {
          relationship = 'pending_received';
          requestId = pendingReceivedMap.get(uIdStr);
        }

        const completedQuests = await Quest.countDocuments({
          userId: u._id,
          status: 'completed'
        });

        return {
          _id: u._id,
          name: u.name,
          username: u.username,
          avatar: u.avatar || (u.name ? u.name.charAt(0).toUpperCase() : 'A'),
          level: u.level || 1,
          xp: u.xp || 0,
          streak: u.streak || 0,
          longestStreak: u.longestStreak || u.streak || 0,
          completedQuests,
          relationship,
          requestId
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
};

module.exports = {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  searchUsers
};
