import React from 'react';
import { RotateCcw, Clock, Crown } from 'lucide-react';
import { GameState } from '../types/game';

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
  finalRank: number;
}

export function GameOverScreen({ gameState, onRestart, finalRank }: GameOverScreenProps) {
  const { score, correctAnswers, wrongAnswers, startTime, endTime } = gameState;
  const accuracy = Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) || 0;
  const gameDuration = Math.floor(((endTime?.getTime() || 0) - (startTime?.getTime() || 0)) / 1000);

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-3xl font-bold mb-6">Game Over!</h2>
      
      <div className="space-y-4 mb-8">
        <div className="p-4 bg-purple-50 rounded-lg">
          <Crown className="mx-auto text-purple-600 mb-2" size={32} />
          <p className="text-2xl font-bold text-purple-600">#{finalRank}</p>
          <p className="text-sm text-purple-600">Final Rank</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{score}</p>
          <p className="text-sm text-gray-600">Final Score</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-xl font-bold text-green-600">{correctAnswers}</p>
            <p className="text-sm text-gray-600">Correct</p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-xl font-bold text-red-600">{wrongAnswers}</p>
            <p className="text-sm text-gray-600">Wrong</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xl font-bold text-blue-600">{accuracy}%</p>
            <p className="text-sm text-gray-600">Accuracy</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <Clock className="text-purple-600" size={20} />
              <p className="text-xl font-bold text-purple-600">{gameDuration}s</p>
            </div>
            <p className="text-sm text-gray-600">Duration</p>
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <RotateCcw size={20} />
        Play Again
      </button>
    </div>
  );
}