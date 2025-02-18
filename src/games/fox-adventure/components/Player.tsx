import React from 'react';
import useGameStore from '../state/gameStore';

export const Player: React.FC = () => {
  const player = useGameStore(state => state.player);

  return (
    <div 
      className={`absolute transition-all duration-100 ${
        player.isInvincible ? 'animate-pulse-fast' : ''
      }`}
      style={{
        left: `${player.position.x}%`,
        top: `${player.position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative w-16 h-16">
        {/* Fox body */}
        <div className="absolute inset-0 bg-fox-orange rounded-full">
          {/* Face details here */}
        </div>
      </div>
    </div>
  );
};
