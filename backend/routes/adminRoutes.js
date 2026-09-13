const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const {
  getAdminOverview,
  getAdminUsers,
  getAdminUserById,
  updateUserStatus,
  getAdminGoals,
  getAdminQuests,
  getAdminAchievements,
  createAdminAchievement,
  updateAdminAchievement,
  deleteAdminAchievement
} = require('../controllers/adminController');

// All Admin routes require authentication AND admin role
router.use(protect);
router.use(requireAdmin);

// Overview
router.get('/overview', getAdminOverview);

// User Management
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserById);
router.patch('/users/:id/status', updateUserStatus);

// Goals & Quests Inspection
router.get('/goals', getAdminGoals);
router.get('/quests', getAdminQuests);

// Achievement Catalog Management
router.get('/achievements', getAdminAchievements);
router.post('/achievements', createAdminAchievement);
router.put('/achievements/:id', updateAdminAchievement);
router.delete('/achievements/:id', deleteAdminAchievement);

module.exports = router;
