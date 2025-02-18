import React from 'react';
import useGameStore from '../state/gameStore';

export const Player: React.FC = () => {
  const player = useGameStore(state => state.player);

  return (
    <div 
      className={`absolute transition-all duration-100 ${
        player.isInvincible ? 'animate-pulse' : ''
      }`}
      style={{
        left: `${player.position.x}%`,
        top: `${player.position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Fox body */}
      <div className="relative w-16 h-16">
        {/* Main body */}
        <div className="absolute inset-0 bg-fox-orange rounded-full">
          {/* Face */}
          <div className="absolute inset-0">
            {/* Eyes */}
            <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-dark-accent rounded-full" />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-dark-accent rounded-full" />
            
            {/* Nose */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-dark-accent rounded-full transform -translate-x-1/2" />
          </div>

          {/* Ears */}
          <div className="absolute -top-4 -left-2 w-4 h-4 bg-fox-orange transform rotate-45" />
          <div className="absolute -top-4 -right-2 w-4 h-4 bg-fox-orange transform -rotate-45" />

          {/* Tail */}
          <div className="absolute -bottom-4 left-1/2 w-3 h-6 bg-fox-orange rounded-full transform -translate-x-1/2 origin-top animate-wag" />
        </div>

        {/* Power-up effects */}
        {player.isInvincible && (
          <div className="absolute inset-0 rounded-full border-4 border-accent-neon animate-pulse" />
        )}
        
        {/* Key indicator */}
        {player.hasKey && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-accent-primary rounded-full animate-float" />
          </div>
        )}

        {/* Health indicator */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12">
          <div className="w-full h-1 bg-background-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${player.health}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};