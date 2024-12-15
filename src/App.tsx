import React from 'react';
import { StartScreen } from './components/StartScreen/StartScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { useGame } from './hooks/useGame';
import { useTimer } from './hooks/useTimer';
import { useLeaderboard } from './hooks/useLeaderboard';

export default function App() {
  const { gameState, handleStart, handleAnswer, handleGameOver, handleRestart } = useGame();
  const timeLeft = useTimer(gameState.isPlaying, gameState.correctAnswers, handleGameOver);
  const { players, activePlayers, updateLeaderboard, updateLocalScore, getCurrentRank } = useLeaderboard();

  // Oyun durumu değiştiğinde local skoru güncelle
  React.useEffect(() => {
    if (gameState.isPlaying && gameState.player) {
      updateLocalScore(gameState.player, gameState.score);
    }
  }, [gameState.score, gameState.player, gameState.isPlaying, updateLocalScore]);

  const handleGameFinish = async () => {
    if (gameState.player && gameState.score > 0) {
      await updateLeaderboard({
        name: gameState.player,
        score: gameState.score,
        accuracy: Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.wrongAnswers)) * 100) || 0,
        gameDuration: Math.floor(((gameState.endTime?.getTime() || 0) - (gameState.startTime?.getTime() || 0)) / 1000),
      });
    }
  };

  React.useEffect(() => {
    if (gameState.isGameOver) {
      handleGameFinish();
    }
  }, [gameState.isGameOver]);

  const currentRank = gameState.player ? getCurrentRank(gameState.player) : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <div className="container mx-auto max-w-6xl flex flex-col gap-8">
        {!gameState.isPlaying && !gameState.isGameOver && (
          <>
            <StartScreen onStart={handleStart} />
            <LeaderboardScreen 
              players={players} 
              activePlayers={activePlayers}
            />
          </>
        )}
        
        {gameState.isPlaying && !gameState.isGameOver && (
          <>
            <GameScreen 
              gameState={gameState}
              timeLeft={timeLeft}
              onAnswer={handleAnswer}
              currentRank={currentRank}
            />
            <LeaderboardScreen 
              players={players}
              activePlayers={activePlayers}
              currentPlayer={gameState.player}
            />
          </>
        )}
        
        {gameState.isGameOver && (
          <>
            <GameOverScreen 
              gameState={gameState}
              onRestart={handleRestart}
              finalRank={currentRank}
            />
            <LeaderboardScreen 
              players={players}
              activePlayers={activePlayers}
              currentPlayer={gameState.player}
            />
          </>
        )}
      </div>
  
      {/* Footer Mesajı */}
      <footer className="absolute bottom-0 left-0 w-full bg-gray-200 text-center p-2 text-sm text-gray-600">
        Powered by <span className="font-semibold">Muhammed Bera Çetin</span> using Artificial Intelligence
      </footer>
    </div>
  );
  
}