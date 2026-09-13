const express = require('express');
const router = express.Router();
const {
  getTodayChallenge,
  getChallengeHistory,
  generateChallenge,
  completeChallenge
} = require('../controllers/dailyChallengeController');
const { protect } = require('../middleware/authMiddleware');

// All daily challenge routes are protected by JWT authentication
router.use(protect);

router.get('/today', getTodayChallenge);
router.get('/history', getChallengeHistory);
router.post('/generate', generateChallenge);
router.patch('/:id/complete', completeChallenge);

module.exports = router;
