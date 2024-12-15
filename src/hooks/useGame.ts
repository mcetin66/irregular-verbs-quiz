import { useState, useCallback } from 'react';
import { GameState } from '../types/game';
import { GAME_CONSTANTS } from '../config/constants';
import { getRandomVerb, generateOptions } from '../utils/game';

const initialGameState: GameState = {
  player: '',
  score: 0,
  mistakes: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  strike: 0,
  consecutiveCorrect: 0,
  isGameOver: false,
  isPlaying: false,
  usedVerbs: new Set<string>(),
  currentOptions: [],
  currentVerb: undefined,
  startTime: undefined,
  endTime: undefined
};

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const getNextVerb = useCallback(() => {
    try {
      const nextVerb = getRandomVerb(gameState.usedVerbs);
      if (nextVerb) {
        const options = generateOptions(nextVerb);
        setGameState(prev => ({
          ...prev,
          currentVerb: nextVerb,
          currentOptions: options,
          usedVerbs: new Set([...prev.usedVerbs, nextVerb.base])
        }));
      }
    } catch (error) {
      console.error('Error getting next verb:', error);
    }
  }, [gameState.usedVerbs]);

  const handleStart = useCallback((playerName: string) => {
    setGameState({
      ...initialGameState,
      player: playerName,
      isPlaying: true,
      startTime: new Date(),
      usedVerbs: new Set()
    });
    getNextVerb();
  }, [getNextVerb]);

  const handleAnswer = useCallback((answer: string) => {
    if (!gameState.currentVerb) return;

    const isCorrect = answer === gameState.currentVerb.past;
    
    setGameState(prev => {
      // Yeni ardışık doğru sayısını hesapla
      const newConsecutiveCorrect = isCorrect ? prev.consecutiveCorrect + 1 : 0;
      
      // Her 5 doğru cevap için strike artır
      const newStrike = Math.floor(newConsecutiveCorrect / 5);
      
      // Puanları hesapla
      const basePoints = isCorrect ? GAME_CONSTANTS.POINTS.CORRECT : GAME_CONSTANTS.POINTS.WRONG;
      const strikeBonus = isCorrect && newConsecutiveCorrect % 5 === 0 ? GAME_CONSTANTS.POINTS.STRIKE_BONUS : 0;
      
      const newMistakes = prev.mistakes + (isCorrect ? 0 : 1);
      const isGameOver = newMistakes >= GAME_CONSTANTS.MAX_MISTAKES;

      const newState = {
        ...prev,
        score: Math.max(0, prev.score + basePoints + strikeBonus),
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
        mistakes: newMistakes,
        strike: newStrike,
        consecutiveCorrect: newConsecutiveCorrect,
        isGameOver: isGameOver,
        isPlaying: !isGameOver,
        endTime: isGameOver ? new Date() : prev.endTime
      };

      return newState;
    });

    if (!gameState.isGameOver && gameState.mistakes < GAME_CONSTANTS.MAX_MISTAKES) {
      getNextVerb();
    }
  }, [gameState.currentVerb, gameState.mistakes, getNextVerb]);

  const handleGameOver = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      isPlaying: false,
      endTime: new Date()
    }));
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  return {
    gameState,
    handleStart,
    handleAnswer,
    handleGameOver,
    handleRestart
  };
}