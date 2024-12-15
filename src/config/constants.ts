export const GAME_CONSTANTS = {
  INITIAL_TIME: 15,
  MAX_MISTAKES: 3,
  POINTS: {
    CORRECT: 3,
    WRONG: -3,
    STRIKE_BONUS: 10,
    STRIKE_TIME_BONUS: 3
  }
} as const;

export const API_CONFIG = {
  BASE_URL: 'https://api.jsonbin.io/v3/b',
  CACHE_TIME: 30 * 1000, // 30 seconds
  ACTIVE_PLAYER_TIMEOUT: 2 * 60 * 1000 // 2 minutes
} as const;