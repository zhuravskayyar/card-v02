// Rewards and progression system (MVP stub)
import { CARDS } from '../data/cards.js';
import { random } from '../core/rng.js';

// Calculate rewards based on duel result
export const calculateRewards = (duelResult, duelStats) => {
  const rewards = {
    xp: 0,
    coins: 0,
    newCards: []
  };

  // Base rewards
  if (duelResult === 'victory') {
    rewards.xp = 100;
    rewards.coins = 50;
    
    // Chance for new card
    if (random.bool(0.3)) { // 30% chance
      const randomCard = random.choice(CARDS);
      rewards.newCards.push(randomCard);
    }
  } else if (duelResult === 'defeat') {
    rewards.xp = 20;
    rewards.coins = 10;
  } else if (duelResult === 'draw') {
    rewards.xp = 50;
    rewards.coins = 25;
  }

  // Bonus for rounds survived
  if (duelStats && duelStats.rounds) {
    rewards.xp += duelStats.rounds * 5;
  }

  // Bonus for damage dealt
  if (duelStats && duelStats.damageDealt) {
    rewards.xp += Math.floor(duelStats.damageDealt / 10);
  }

  return rewards;
};

// Apply rewards to player profile
export const applyRewards = (profile, rewards) => {
  const updatedProfile = { ...profile };
  
  updatedProfile.xp = (updatedProfile.xp || 0) + rewards.xp;
  updatedProfile.coins = (updatedProfile.coins || 0) + rewards.coins;
  
  // Add new cards to collection
  if (rewards.newCards && rewards.newCards.length > 0) {
    updatedProfile.collection = updatedProfile.collection || [];
    rewards.newCards.forEach(card => {
      if (!updatedProfile.collection.includes(card.id)) {
        updatedProfile.collection.push(card.id);
      }
    });
  }

  // Level up check (use exponential xpNeededForLevel)
  const xpNeededForLevel = (level) => {
    const L = Math.max(1, Number(level) || 1);
    const BASE = 200;
    const GROWTH = 1.12;
    return Math.round(BASE * Math.pow(GROWTH, L - 1));
  };

  // Compute new level by subtracting required XP per level
  let remaining = updatedProfile.xp || 0;
  let newLevel = 1;
  while (remaining >= xpNeededForLevel(newLevel)) {
    remaining -= xpNeededForLevel(newLevel);
    newLevel += 1;
    // safety cap to avoid infinite loops
    if (newLevel > 1000) break;
  }
  const oldLevel = profile.level || 1;
  if (newLevel > oldLevel) {
    updatedProfile.level = newLevel;
    updatedProfile.leveledUp = true;
  }

  return updatedProfile;
};

// Get level from XP
export const getLevelFromXP = (xp) => {
  const xpNeededForLevel = (level) => {
    const L = Math.max(1, Number(level) || 1);
    const BASE = 200;
    const GROWTH = 1.12;
    return Math.round(BASE * Math.pow(GROWTH, L - 1));
  };
  let remaining = xp || 0;
  let level = 1;
  while (remaining >= xpNeededForLevel(level)) {
    remaining -= xpNeededForLevel(level);
    level += 1;
    if (level > 1000) break;
  }
  return level;
};

// Get XP needed for next level
export const getXPForNextLevel = (currentXP) => {
  const currentLevel = getLevelFromXP(currentXP);
  const xpNeededForLevel = (level) => {
    const L = Math.max(1, Number(level) || 1);
    const BASE = 200;
    const GROWTH = 1.12;
    return Math.round(BASE * Math.pow(GROWTH, L - 1));
  };
  const nextLevelTotal = xpNeededForLevel(currentLevel);
  return nextLevelTotal - currentXP;
};

// Daily reward system (stub)
export const getDailyReward = () => {
  return {
    coins: 100,
    cards: random.sample(CARDS, 1)
  };
};

// Achievement check (stub)
export const checkAchievements = (profile) => {
  const achievements = [];
  
  if (profile.wins >= 10) {
    achievements.push({ id: 'win_10', name: '10 перемог', reward: 200 });
  }
  
  if (profile.wins >= 50) {
    achievements.push({ id: 'win_50', name: '50 перемог', reward: 1000 });
  }
  
  if (profile.gamesPlayed >= 100) {
    achievements.push({ id: 'games_100', name: '100 ігор', reward: 500 });
  }
  
  return achievements;
};

export default {
  calculateRewards,
  applyRewards,
  getLevelFromXP,
  getXPForNextLevel,
  getDailyReward,
  checkAchievements
};
