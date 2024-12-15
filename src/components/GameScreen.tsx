import React from 'react';
import { Timer, Heart, Trophy } from 'lucide-react';
import { GameState } from '../types/game';
import { GAME_CONSTANTS } from '../config/constants';

interface GameScreenProps {
  gameState: GameState;
  timeLeft: number;
  onAnswer: (answer: string) => void;
  currentRank: number;
}

export function GameScreen({ gameState, timeLeft, onAnswer, currentRank }: GameScreenProps) {
  const { score, mistakes, strike, currentVerb, currentOptions, correctAnswers } = gameState;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <span className="font-bold">{score} points</span>
          <span className="text-sm text-gray-500">(#{currentRank})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Timer className="text-blue-500" />
          <span className="font-bold">{timeLeft}s</span>
        </div>
        
        <div className="flex items-center gap-1">
          {[...Array(3 - mistakes)].map((_, i) => (
            <Heart key={i} className="text-red-500" fill="currentColor" />
          ))}
          {[...Array(mistakes)].map((_, i) => (
            <Heart key={i + 3} className="text-gray-300" />
          ))}
        </div>
      </div>

      {currentVerb && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2">What's the past tense of:</h2>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{currentVerb.base}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentOptions.map((option) => (
              <button
                key={option}
                onClick={() => onAnswer(option)}
                className="p-4 text-lg font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors active:bg-gray-300"
              >
                {option}
              </button>
            ))}
          </div>

          {strike > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full animate-bounce">
                <span className="text-green-600 font-medium">
                  🔥 Strike {strike}! (+{GAME_CONSTANTS.POINTS.STRIKE_BONUS} points, +{GAME_CONSTANTS.POINTS.STRIKE_TIME_BONUS}s)
                </span>
                <span className="text-xs text-green-500">
                  {5 - (correctAnswers % 5)} to next strike
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}