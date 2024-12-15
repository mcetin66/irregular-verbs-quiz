import { API_CONFIG } from '../config/constants';
import { Player } from '../types/game';

export class LeaderboardAPI {
  private static instance: LeaderboardAPI;
  private cache: {
    data: Player[] | null;
    timestamp: number;
  } = {
    data: null,
    timestamp: 0
  };

  private constructor() {}

  static getInstance(): LeaderboardAPI {
    if (!this.instance) {
      this.instance = new LeaderboardAPI();
    }
    return this.instance;
  }

  private async fetchWithHeaders(url: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Master-Key': import.meta.env.VITE_JSONBIN_API_KEY,
      'X-Bin-Meta': 'false'
    };

    try {
      const response = await fetch(url, { 
        ...options, 
        headers: { ...headers, ...options.headers }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private isCacheValid(): boolean {
    return (
      this.cache.data !== null &&
      Date.now() - this.cache.timestamp < API_CONFIG.CACHE_TIME
    );
  }

  async getLeaderboard(): Promise<Player[]> {
    if (this.isCacheValid()) {
      return this.cache.data!;
    }

    try {
      const response = await this.fetchWithHeaders(
        `${API_CONFIG.BASE_URL}/${import.meta.env.VITE_JSONBIN_BIN_ID}/latest`
      );
      
      const data = await response.json();
      const players = Array.isArray(data) ? data : [];

      this.cache = {
        data: players,
        timestamp: Date.now()
      };
      
      return this.cache.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return this.cache.data || [];
    }
  }

  async updateLeaderboard(newPlayer: { name: string, score: number }): Promise<boolean> {
    try {
      const currentPlayers = await this.getLeaderboard();
      const existingPlayer = currentPlayers.find(p => p.name === newPlayer.name);

      let updatedPlayer: Player;
      if (existingPlayer) {
        updatedPlayer = {
          ...existingPlayer,
          gamesPlayed: existingPlayer.gamesPlayed + 1,
          highScore: Math.max(existingPlayer.highScore, newPlayer.score)
        };
      } else {
        updatedPlayer = {
          name: newPlayer.name,
          gamesPlayed: 1,
          highScore: newPlayer.score
        };
      }

      const updatedPlayers = existingPlayer
        ? currentPlayers.map(p => p.name === newPlayer.name ? updatedPlayer : p)
        : [...currentPlayers, updatedPlayer];

      const response = await this.fetchWithHeaders(
        `${API_CONFIG.BASE_URL}/${import.meta.env.VITE_JSONBIN_BIN_ID}`,
        {
          method: 'PUT',
          body: JSON.stringify(updatedPlayers)
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update leaderboard');
      }

      this.cache = {
        data: updatedPlayers,
        timestamp: Date.now()
      };
      
      return true;
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      return false;
    }
  }
}