import { useEffect } from 'react';
import useGameStore from '../state/gameStore';

export const useGameControls = () => {
  const gameStore = useGameStore();

  useEffect(() => {
    const keys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key);
      
      if (e.key === 'Escape') {
        if (gameStore.gameStatus === 'PLAYING') {
          gameStore.pauseGame();
        } else if (gameStore.gameStatus === 'PAUSED') {
          gameStore.resumeGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key);
    };

    const updatePlayerMovement = () => {
      if (gameStore.gameStatus !== 'PLAYING') return;

      const direction = { x: 0, y: 0 };

      if (keys.has('ArrowUp') || keys.has('w')) direction.y -= 1;
      if (keys.has('ArrowDown') || keys.has('s')) direction.y += 1;
      if (keys.has('ArrowLeft') || keys.has('a')) direction.x -= 1;
      if (keys.has('ArrowRight') || keys.has('d')) direction.x += 1;

      if (direction.x !== 0 || direction.y !== 0) {
        // Normalize diagonal movement
        const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        direction.x /= magnitude;
        direction.y /= magnitude;
        
        gameStore.movePlayer(direction);
      }
    };

    let animationFrameId: number;
    const gameLoop = () => {
      updatePlayerMovement();
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    animationFrameId = requestAnimationFrame(gameLoop);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
};