const express = require('express');
const router = express.Router();
const {
  createGoal,
  getMyGoals,
  getGoalById,
  updateGoal,
  deleteGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

// All Goal routes are protected with JWT
router.use(protect);

// /api/goals
router.route('/')
  .post(createGoal)
  .get(getMyGoals);

// /api/goals/:id
router.route('/:id')
  .get(getGoalById)
  .put(updateGoal)
  .delete(deleteGoal);

module.exports = router;
