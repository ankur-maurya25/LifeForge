const mongoose = require('mongoose');
const AICoachMessage = require('../models/AICoachMessage');
const {
  getUserCoachContext,
  generateRuleBasedRecommendations,
  generateCoachChatResponse
} = require('../utils/aiCoachService');

const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database connection is currently offline. Please ensure MongoDB is running.'
    });
    return false;
  }
  return true;
};

/**
 * @desc    Send a message to the AI Life Coach and receive a response
 * @route   POST /api/ai-coach/chat
 * @access  Private (JWT)
 */
const chatWithCoach = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.'
      });
    }

    const cleanMessage = message.trim();

    if (cleanMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 2000 characters.'
      });
    }

    // 1. Gather sanitized user progress context
    const context = await getUserCoachContext(userId);

    // 2. Generate response (AI or fallback)
    const aiResult = await generateCoachChatResponse(cleanMessage, context);

    // 3. Persist user message in history
    await AICoachMessage.create({
      userId,
      role: 'user',
      message: cleanMessage
    });

    // 4. Persist AI response in history
    const savedAssistantMsg = await AICoachMessage.create({
      userId,
      role: 'assistant',
      message: aiResult.message,
      suggestions: aiResult.suggestions || [],
      relatedData: {
        goalId: aiResult.relatedGoalId || null,
        questId: aiResult.relatedQuestId || null
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        _id: savedAssistantMsg._id,
        role: 'assistant',
        message: aiResult.message,
        suggestions: aiResult.suggestions || [],
        relatedGoalId: aiResult.relatedGoalId || null,
        relatedQuestId: aiResult.relatedQuestId || null,
        createdAt: savedAssistantMsg.createdAt
      }
    });
  } catch (error) {
    console.error('❌ [chatWithCoach error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI Coach chat request',
      error: error.message
    });
  }
};

/**
 * @desc    Get smart recommendations based on real user progress
 * @route   GET /api/ai-coach/recommendations
 * @access  Private (JWT)
 */
const getRecommendations = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    const context = await getUserCoachContext(userId);
    const recommendations = generateRuleBasedRecommendations(context);

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
      context: {
        heroName: context?.heroName,
        level: context?.level,
        streak: context?.streak,
        pendingQuestsCount: context?.pendingQuestsCount,
        activeGoalsCount: context?.activeGoalsCount
      }
    });
  } catch (error) {
    console.error('❌ [getRecommendations error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
};

/**
 * @desc    Get conversation history for authenticated user
 * @route   GET /api/ai-coach/history
 * @access  Private (JWT)
 */
const getChatHistory = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 30);

    const history = await AICoachMessage.find({ userId })
      .sort({ createdAt: 1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('❌ [getChatHistory error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve AI Coach history',
      error: error.message
    });
  }
};

/**
 * @desc    Clear chat history for authenticated user
 * @route   DELETE /api/ai-coach/history
 * @access  Private (JWT)
 */
const clearChatHistory = async (req, res) => {
  if (!checkDbConnection(res)) return;

  try {
    const userId = req.user._id;
    await AICoachMessage.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: 'AI Coach chat history cleared successfully.'
    });
  } catch (error) {
    console.error('❌ [clearChatHistory error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear chat history',
      error: error.message
    });
  }
};

module.exports = {
  chatWithCoach,
  getRecommendations,
  getChatHistory,
  clearChatHistory
};
