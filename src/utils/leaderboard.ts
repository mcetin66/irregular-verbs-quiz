import { Player } from '../types/game';

export function sortPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.highScore - a.highScore);
}

export function calculateRank(players: Player[], playerName: string): number {
  const sortedPlayers = sortPlayers(players);
  const rank = sortedPlayers.findIndex(p => p.name === playerName) + 1;
  return rank > 0 ? rank : sortedPlayers.length + 1;
}

export function mergePlayerData(
  existingPlayer: Player | undefined,
  newScore: number
): Player {
  if (!existingPlayer) {
    return {
      name: '',
      gamesPlayed: 1,
      highScore: newScore
    };
  }

  return {
    ...existingPlayer,
    gamesPlayed: existingPlayer.gamesPlayed + 1,
    highScore: Math.max(existingPlayer.highScore, newScore)
  };
}