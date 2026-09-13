const mongoose = require('mongoose');

/**
 * FriendRequest Schema
 * Represents pending, accepted, or rejected friend requests between users.
 */
const FriendRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required']
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Prevent user from sending request to themselves
FriendRequestSchema.pre('save', function (next) {
  if (this.senderId.toString() === this.receiverId.toString()) {
    const err = new Error('You cannot send a friend request to yourself');
    err.statusCode = 400;
    return next(err);
  }
  next();
});

// Indexes for fast lookup of incoming and outgoing requests
FriendRequestSchema.index({ senderId: 1, receiverId: 1 });
FriendRequestSchema.index({ receiverId: 1, status: 1 });
FriendRequestSchema.index({ senderId: 1, status: 1 });

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);
