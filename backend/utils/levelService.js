/**
 * LifeForge Level Calculation & Progression Engine
 *
 * Consistent with Quest, Daily Challenge, and Analytics rules:
 * - 500 XP required per level
 * - Level 1: 0 - 499 XP
 * - Level 2: 500 - 999 XP
 * - Level N: (N-1)*500 to N*500 - 1 XP
 */

const XP_PER_LEVEL = 500;

/**
 * Calculate user level based on total XP
 * @param {number} totalXp 
 * @returns {number} Level (minimum 1)
 */
function calculateLevel(totalXp = 0) {
  const safeXp = Math.max(0, Number(totalXp) || 0);
  return Math.floor(safeXp / XP_PER_LEVEL) + 1;
}

/**
 * Calculate detailed level progression for UI
 * @param {number} totalXp 
 */
function getLevelProgress(totalXp = 0) {
  const safeXp = Math.max(0, Number(totalXp) || 0);
  const currentLevel = calculateLevel(safeXp);
  const currentLevelBaseXp = (currentLevel - 1) * XP_PER_LEVEL;
  const currentLevelXp = safeXp - currentLevelBaseXp;
  const xpNeededForNext = XP_PER_LEVEL;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / xpNeededForNext) * 100));

  return {
    totalXp: safeXp,
    currentLevel,
    currentLevelXp,
    xpNeededForNext,
    nextLevelTotalXp: currentLevel * XP_PER_LEVEL,
    progressPercent
  };
}

/**
 * Check if adding XP will cause a level up
 * @param {number} currentTotalXp 
 * @param {number} addedXp 
 */
function checkLevelUp(currentTotalXp = 0, addedXp = 0) {
  const safeCurrent = Math.max(0, Number(currentTotalXp) || 0);
  const safeAdded = Math.max(0, Number(addedXp) || 0);
  const oldLevel = calculateLevel(safeCurrent);
  const newTotalXp = safeCurrent + safeAdded;
  const newLevel = calculateLevel(newTotalXp);

  return {
    leveledUp: newLevel > oldLevel,
    oldLevel,
    newLevel,
    newTotalXp,
    levelsGained: newLevel - oldLevel
  };
}

module.exports = {
  XP_PER_LEVEL,
  calculateLevel,
  getLevelProgress,
  checkLevelUp
};
