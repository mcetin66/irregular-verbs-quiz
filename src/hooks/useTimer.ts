import { useState, useEffect } from 'react';
import { GAME_CONSTANTS } from '../config/constants';

export function useTimer(isPlaying: boolean, correctAnswers: number, onTimeEnd: () => void) {
  const [timeLeft, setTimeLeft] = useState(GAME_CONSTANTS.INITIAL_TIME);

  useEffect(() => {
    if (!isPlaying) {
      setTimeLeft(GAME_CONSTANTS.INITIAL_TIME);
      return;
    }

    // Her 5 doğru cevap için strike bonus süre ekle
    if (correctAnswers > 0 && correctAnswers % 5 === 0) {
      setTimeLeft(prev => prev + GAME_CONSTANTS.POINTS.STRIKE_TIME_BONUS);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, correctAnswers, onTimeEnd]);

  return timeLeft;
}