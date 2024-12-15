import React from 'react';
import { Users, Trophy, Target } from 'lucide-react';

export function GameStats() {
  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <Users className="text-blue-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-blue-700">1.2K+</p>
            <p className="text-sm text-blue-600">Aktif Oyuncu</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
          <Trophy className="text-yellow-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-yellow-700">50K+</p>
            <p className="text-sm text-yellow-600">Toplam Oyun</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
          <Target className="text-green-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-green-700">85%</p>
            <p className="text-sm text-green-600">Ort. Başarı</p>
          </div>
        </div>
      </div>
    </div>
  );
}