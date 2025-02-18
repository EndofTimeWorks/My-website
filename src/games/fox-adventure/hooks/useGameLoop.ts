import { useEffect, useRef } from 'react';
import useGameStore from '../state/gameStore';

export const useGameLoop = () => {
  const frameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const gameStore = useGameStore();

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      const deltaTime = timestamp - lastUpdateRef.current;

      if (gameStore.gameStatus === 'PLAYING') {
        // Update game state
        gameStore.updateEnemies();
        checkCollisions();
        updatePowerUps(deltaTime);
      }

      lastUpdateRef.current = timestamp;
      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
};
