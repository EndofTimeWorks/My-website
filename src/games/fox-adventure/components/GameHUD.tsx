import React from 'react';
import useGameStore from '../state/gameStore';
import { Heart, Star, Timer, Trophy } from 'lucide-react';

export const GameHUD: React.FC = () => {
  const { player, score, level, timePlayed } = useGameStore();

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
      {/* Left section - Health and PowerUps */}
      <div className="space-y-4">
        {/* Health bar */}
        <div className="flex items-center gap-2 bg-background-primary/50 p-2 rounded-lg backdrop-blur-sm">
          <Heart 
            className={`w-6 h-6 ${
              player.health > 20 ? 'text-red-500' : 'text-red-500 animate-pulse'
            }`} 
          />
          <div className="w-32 h-3 bg-background-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${player.health}%` }}
            />
          </div>
        </div>

        {/* Active power-ups */}
        <div className="flex gap-2">
          {player.powerUps.map((powerUp) => (
            <div 
              key={powerUp.id}
              className="bg-background-primary/50 p-2 rounded-lg backdrop-blur-sm"
            >
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 bg-accent-primary/20 rounded-full animate-ping" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Score and Level */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center space-y-2">
        <div className="bg-background-primary/50 px-4 py-2 rounded-lg backdrop-blur-sm">
          <div className="text-2xl font-bold text-accent-neon">Level {level}</div>
          <div className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-xl">{score.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Right section - Time and High Score */}
      <div className="space-y-4 text-right">
        <div className="bg-background-primary/50 p-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
          <Timer className="w-5 h-5 text-accent-primary" />
          <span>{formatTime(timePlayed)}</span>
        </div>
        <div className="bg-background-primary/50 p-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span>Best: {Math.max(...useGameStore.getState().highScores).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};