import React, { useEffect, useState } from 'react';
import useGameStore from '../state/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGameControls } from '../hooks/useGameControls';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Collectible } from './Collectible';
import { PowerUp } from './PowerUp';
import { GameHUD } from './GameHUD';
import { GameOverlay } from './GameOverlay';

const FoxGame: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  
  // Initialize game systems
  useGameLoop();
  useGameControls();

  // Konami code for game activation
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let index = 0;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === konamiCode[index]) {
        index++;
        if (index === konamiCode.length) {
          setIsActive(true);
          useGameStore.getState().startNewGame();
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-gradient-game z-50">
      <div className="relative w-full h-full overflow-hidden game-viewport">
        {/* Game world */}
        <div className="absolute inset-0">
          <Player />
          {/* Other game elements render here */}
        </div>
        <GameHUD />
        <GameOverlay />
      </div>
    </div>
  );
};

export default FoxGame;
