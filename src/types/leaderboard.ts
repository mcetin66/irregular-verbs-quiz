import { Player } from './game';

export interface LeaderboardState {
  players: Player[];
  activePlayers: Set<string>;
  localCache: { [key: string]: Player };
}

export interface LeaderboardActions {
  updateLocalScore: (playerName: string, score: number) => void;
  updateLeaderboard: (player: { name: string; score: number }) => void;
  getCurrentRank: (playerName: string) => number;
  refreshLeaderboard: () => Promise<void>;
}