import { Player } from '../types/game';
import { fetchWithHeaders, getLeaderboardUrl, getUpdateUrl } from '../utils/api';
import { isCacheValid, updateCache } from '../utils/cache';
import { mergePlayerData } from '../utils/leaderboard';

export class LeaderboardService {
  private static instance: LeaderboardService;
  private cache: {
    data: Player[] | null;
    timestamp: number;
  } = {
    data: null,
    timestamp: 0
  };

  private constructor() {}

  static getInstance(): LeaderboardService {
    if (!this.instance) {
      this.instance = new LeaderboardService();
    }
    return this.instance;
  }

  async getLeaderboard(): Promise<Player[]> {
    if (this.cache.data && isCacheValid(this.cache.timestamp)) {
      return this.cache.data;
    }

    try {
      const response = await fetchWithHeaders(getLeaderboardUrl());
      const data = await response.json();
      const players = Array.isArray(data) ? data : [];
      
      this.cache = updateCache(players);
      return this.cache.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return this.cache.data || [];
    }
  }

  async updateLeaderboard(newPlayer: { name: string; score: number }): Promise<boolean> {
    try {
      const currentPlayers = await this.getLeaderboard();
      const existingPlayer = currentPlayers.find(p => p.name === newPlayer.name);
      const updatedPlayer = mergePlayerData(existingPlayer, newPlayer.score);

      const updatedPlayers = existingPlayer
        ? currentPlayers.map(p => p.name === newPlayer.name ? updatedPlayer : p)
        : [...currentPlayers, updatedPlayer];

      const response = await fetchWithHeaders(getUpdateUrl(), {
        method: 'PUT',
        body: JSON.stringify(updatedPlayers)
      });

      if (!response.ok) {
        throw new Error('Failed to update leaderboard');
      }

      this.cache = updateCache(updatedPlayers);
      return true;
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      return false;
    }
  }
}