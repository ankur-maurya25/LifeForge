const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  chatWithCoach,
  getRecommendations,
  getChatHistory,
  clearChatHistory
} = require('../controllers/aiCoachController');

// All AI Coach routes are protected
router.use(protect);

router.post('/chat', chatWithCoach);
router.get('/recommendations', getRecommendations);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

module.exports = router;
