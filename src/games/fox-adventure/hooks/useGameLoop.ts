import { useEffect, useRef } from 'react';
import useGameStore from '../state/gameStore';

export const useGameLoop = () => {
  const frameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const gameStore = useGameStore();

  useEffect(() => {
    const spawnCollectible = () => {
      const now = Date.now();
      if (now - lastSpawnRef.current < 2000) return; // Spawn every 2 seconds
      
      lastSpawnRef.current = now;
      const collectible: any = {
        id: `collectible-${now}`,
        type: Math.random() > 0.8 ? 'GEM' : 'STAR',
        value: Math.random() > 0.8 ? 10 : 5,
        position: {
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5
        }
      };
      
      gameStore.collectibles.push(collectible);
    };

    const gameLoop = (timestamp: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      const deltaTime = timestamp - lastUpdateRef.current;

      if (gameStore.gameStatus === 'PLAYING') {
        // Update entities
        gameStore.updateEnemies(deltaTime);
        
        // Spawn collectibles
        spawnCollectible();

        // Check collisions
        const { player, enemies, collectibles } = gameStore;
        
        // Enemy collisions
        enemies.forEach(enemy => {
          const dx = player.position.x - enemy.position.x;
          const dy = player.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 5 && !player.isInvincible) {
            gameStore.takeDamage(20);
          }
        });

        // Collectible collisions
        collectibles.forEach(collectible => {
          const dx = player.position.x - collectible.position.x;
          const dy = player.position.y - collectible.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 5) {
            gameStore.collectItem(collectible.id);
          }
        });
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

