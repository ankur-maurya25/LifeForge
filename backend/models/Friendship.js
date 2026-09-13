const mongoose = require('mongoose');

/**
 * Friendship Schema
 * Represents an active accepted bilateral friendship between two users.
 * Symmetrically ordered (user1 < user2) for unique canonical representation.
 */
const FriendshipSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User 1 is required']
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User 2 is required']
    }
  },
  {
    timestamps: true
  }
);

// Canonical ordering: enforce user1 < user2 before saving
FriendshipSchema.pre('save', function (next) {
  if (this.user1.toString() === this.user2.toString()) {
    const err = new Error('A user cannot be friends with themselves');
    err.statusCode = 400;
    return next(err);
  }

  if (this.user1.toString() > this.user2.toString()) {
    const temp = this.user1;
    this.user1 = this.user2;
    this.user2 = temp;
  }
  next();
});

// Compound unique index ensuring only one friendship record per pair
FriendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });
FriendshipSchema.index({ user2: 1 });

module.exports = mongoose.model('Friendship', FriendshipSchema);
