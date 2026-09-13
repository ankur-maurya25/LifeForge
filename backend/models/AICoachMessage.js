const mongoose = require('mongoose');

const aiCoachMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: [true, 'Role is required']
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [4000, 'Message content cannot exceed 4000 characters']
    },
    suggestions: [
      {
        type: String,
        trim: true
      }
    ],
    relatedData: {
      goalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        default: null
      },
      questId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest',
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

aiCoachMessageSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model('AICoachMessage', aiCoachMessageSchema);
