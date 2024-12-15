import React from 'react';
import { Trophy, Wifi, RefreshCw, Crown, Info, Gamepad, Zap } from 'lucide-react';
import { Player } from '../types/game';
import { useLeaderboard } from '../hooks/useLeaderboard';

interface LeaderboardScreenProps {
  players: Player[];
  activePlayers: Set<string>;
  currentPlayer?: string;
}

export function LeaderboardScreen({ players, activePlayers, currentPlayer }: LeaderboardScreenProps) {
  const sortedPlayers = [...players].sort((a, b) => b.highScore - a.highScore).slice(0, 10);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const { refreshLeaderboard } = useLeaderboard();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshLeaderboard();
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Crown className="text-yellow-500" size={24} />
            <h2 className="text-xl md:text-2xl font-bold">Top 10 Players</h2>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-500 hover:text-gray-700"
            title="Show statistics info"
          >
            <Info size={20} />
          </button>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-blue-400"
        >
          <RefreshCw 
            size={18} 
            className={`${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {showInfo && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
          <ul className="space-y-1">
            <li>• High Score: En yüksek puan</li>
            <li>• Games: Toplam oyun sayısı</li>
            <li>• Strikes: En yüksek strike sayısı</li>
          </ul>
        </div>
      )}

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = player.name === currentPlayer;
          const isActive = activePlayers.has(player.name);

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isCurrentPlayer ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-lg font-bold ${
                  index < 3 ? 'text-yellow-500' : 'text-gray-500'
                }`}>
                  #{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{player.name}</span>
                    {isActive && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Wifi size={10} className="animate-pulse" />
                        LIVE
                      </span>
                    )}
                    {isCurrentPlayer && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Gamepad size={14} />
                      {player.gamesPlayed}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={14} className="text-yellow-500" />
                      {player.strikes || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-purple-600">{player.highScore}</div>
                <div className="text-xs text-gray-500">High Score</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="fixed bottom-4 right-4 bg-white bg-opacity-75 p-2 rounded-lg shadow text-xs text-gray-700">
      Powered by <span className="font-semibold">Muhammed Bera Çetin</span> using Artificial Intelligence
    </div>
    </div>
    
  );
}