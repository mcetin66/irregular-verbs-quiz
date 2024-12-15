import { useState, useEffect, useCallback } from 'react';
import { Player } from '../types/game';
import { LeaderboardAPI } from '../services/api';
import { API_CONFIG } from '../config/constants';

export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayers, setActivePlayers] = useState<Set<string>>(new Set());
  const [localCache, setLocalCache] = useState<{[key: string]: Player}>({});
  const api = LeaderboardAPI.getInstance();

  const loadLeaderboard = async () => {
    try {
      const data = await api.getLeaderboard();
      setPlayers(data.sort((a, b) => b.highScore - a.highScore));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const updateLocalScore = useCallback((playerName: string, score: number) => {
    const currentPlayer = players.find(p => p.name === playerName);
    const newPlayer: Player = {
      name: playerName,
      gamesPlayed: currentPlayer?.gamesPlayed || 1,
      highScore: Math.max(currentPlayer?.highScore || 0, score)
    };

    setLocalCache(prev => ({
      ...prev,
      [playerName]: newPlayer
    }));

    setPlayers(prev => {
      const updated = prev.filter(p => p.name !== playerName);
      updated.push(newPlayer);
      return updated.sort((a, b) => b.highScore - a.highScore);
    });

    setActivePlayers(prev => new Set(prev.add(playerName)));
  }, [players]);

  const updateLeaderboard = async (newPlayer: { name: string, score: number }) => {
    try {
      await api.updateLeaderboard(newPlayer);
      await loadLeaderboard();
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  };

  const getCurrentRank = useCallback((playerName: string): number => {
    const allPlayers = [...players];
    Object.values(localCache).forEach(player => {
      if (!allPlayers.find(p => p.name === player.name)) {
        allPlayers.push(player);
      }
    });
    
    const sortedPlayers = allPlayers.sort((a, b) => b.highScore - a.highScore);
    const rank = sortedPlayers.findIndex(p => p.name === playerName) + 1;
    return rank > 0 ? rank : sortedPlayers.length + 1;
  }, [players, localCache]);

  return { 
    players, 
    activePlayers, 
    updateLeaderboard,
    updateLocalScore,
    getCurrentRank,
    refreshLeaderboard: loadLeaderboard
  };
}