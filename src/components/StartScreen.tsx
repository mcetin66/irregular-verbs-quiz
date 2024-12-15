import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface StartScreenProps {
  onStart: (playerName: string) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Irregular Verb Quiz</h1>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your name"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="font-semibold mb-2">Game Rules:</h2>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>• You have 15 seconds to start</li>
            <li>• +5 seconds bonus for every 5 correct answers</li>
            <li>• Maximum 3 mistakes allowed</li>
            <li>• +3 points for correct answers (increases with streak)</li>
            <li>• -3 points for wrong answers</li>
          </ul>
        </div>

        <button
          onClick={() => playerName.trim() && onStart(playerName)}
          disabled={!playerName.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Play size={20} />
          Start Game
        </button>
      </div>
    </div>
  );
}