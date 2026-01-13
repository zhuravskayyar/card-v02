// Usage:
// 1) Open browser console on your local site (or GitHub Pages site).
// 2) Paste the contents of this file and press Enter.
// Alternatively run with `node create_admin.js` (will modify a JSON file if you adapt it).

(function createAdmin() {
  try {
    const username = 'delta5977525';
    const USERS_KEY = 'elem_users';
    const STORAGE_KEY = 'elem_user_profile';

    const now = Date.now();

    // Build starter deck similar to in-app registration logic
    const starterIds = (window.getRandomStarterCardIds && window.getRandomStarterCardIds(16))
      || (window.getStarterCardIds && window.getStarterCardIds())
      || [];
    const pool = starterIds.length ? starterIds : (window.ALL_CARDS || []).map(c => c.id);
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selectedIds = shuffled.slice(0, 16);
    const selectedCards = selectedIds
      .map(id => (window.getCardById ? window.getCardById(id) : null))
      .filter(Boolean);

    const deckCards = selectedCards.slice(0, 9).map(card => ({ id: card.id, level: 1 }));
    const collectionCards = selectedCards.slice(9, 16).map(card => ({ id: card.id, level: 1 }));

    const progress = {};
    selectedCards.forEach(card => {
      progress[card.id] = { level: 1, xp: 0 };
    });

    const inventory = {};
    selectedCards.forEach(card => {
      inventory[card.id] = (inventory[card.id] || 0) + 1;
    });

    const adminProfile = {
      name: username,
      level: 1,
      xp: 0,
      bolts: 9999,
      gears: 9999,
      cores: 9999,
      wins: 0,
      losses: 0,
      gamesPlayed: 0,
      createdAt: now,
      deckCards: deckCards,
      collectionCards: collectionCards,
      progress: progress,
      inventory: inventory
    };

    // Read existing users map
    let users = {};
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    } catch (e) {
      console.warn('Failed to parse existing users, overwriting.');
      users = {};
    }

    users[username] = adminProfile;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // Set as current logged-in profile as well
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProfile));

    console.log('Admin profile created/updated:', adminProfile);
    alert('Admin created: ' + username + ' (bolts/gears/cores = 9999)');
  } catch (err) {
    console.error('createAdmin failed', err);
    alert('createAdmin failed: ' + err.message);
  }
})();
