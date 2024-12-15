import React from 'react';
import { ReactNode } from 'react';

interface GameFeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function GameFeature({ icon, title, description }: GameFeatureProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}