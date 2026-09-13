const express = require('express');
const router = express.Router();
const {
  createQuest,
  getMyQuests,
  getQuestById,
  updateQuest,
  completeQuest,
  deleteQuest
} = require('../controllers/questController');
const { protect } = require('../middleware/authMiddleware');

// All quest routes require authenticated JWT
router.use(protect);

// /api/quests
router.route('/')
  .post(createQuest)
  .get(getMyQuests);

// /api/quests/:id
router.route('/:id')
  .get(getQuestById)
  .put(updateQuest)
  .delete(deleteQuest);

// /api/quests/:id/complete
router.patch('/:id/complete', completeQuest);

module.exports = router;
