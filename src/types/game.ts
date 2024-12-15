import { Verb } from './verb';

export interface GameState {
  player: string;
  score: number;
  mistakes: number;
  correctAnswers: number;
  wrongAnswers: number;
  strike: number;
  consecutiveCorrect: number;
  currentVerb?: Verb;
  currentOptions: string[];
  isGameOver: boolean;
  isPlaying: boolean;
  startTime?: Date;
  endTime?: Date;
  usedVerbs: Set<string>;
}

export interface Player {
  name: string;
  gamesPlayed: number;
  highScore: number;
}