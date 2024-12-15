import React, { useState } from 'react';
import { Play, Brain, Timer, Award, Target, Zap } from 'lucide-react';
import { GameFeature } from './GameFeature';
import { GameStats } from './GameStats';

interface StartScreenProps {
  onStart: (playerName: string) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [playerName, setPlayerName] = useState('');

  const features = [
    {
      icon: <Brain className="text-purple-500" size={24} />,
      title: "100+ Düzensiz Fiil",
      description: "Geniş fiil havuzuyla İngilizce pratiği yapın"
    },
    {
      icon: <Timer className="text-blue-500" size={24} />,
      title: "Zaman Bonusu",
      description: "Her 5 doğru cevapta +5 saniye bonus"
    },
    {
      icon: <Award className="text-yellow-500" size={24} />,
      title: "Skor Sistemi",
      description: "Doğru: +3 puan, Yanlış: -3 puan"
    },
    {
      icon: <Target className="text-green-500" size={24} />,
      title: "Zorluk Seviyeleri",
      description: "Kolay, Orta ve Zor seviyeler"
    }
  ];

  return (
    <div className="max-w-4xl w-full mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 bg-black opacity-10 pattern-dots"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2">İngilizce Düzensiz Fiil Quiz</h1>
            <p className="text-blue-100">Test your knowledge of irregular verbs!</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
                  Oyuncu Adı
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="İsminizi girin"
                  />
                  <Zap className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <button
                onClick={() => playerName.trim() && onStart(playerName)}
                disabled={!playerName.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <Play size={20} />
                Oyunu Başlat
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <GameFeature key={index} {...feature} />
              ))}
            </div>
          </div>

          <GameStats />
        </div>
      </div>
    </div>
  );
}