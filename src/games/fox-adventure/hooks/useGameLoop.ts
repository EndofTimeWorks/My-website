import { useEffect, useRef } from "react";
import useGameStore from "../state/gameStore";

export const useGameLoop = () => {
    const frameRef = useRef<number>();
    const lastUpdateRef = useRef<number>(0);
    const lastCollectibleSpawnRef = useRef<number>(0);
    const lastEnemySpawnRef = useRef<number>(0);
    const lastPowerUpSpawnRef = useRef<number>(0);

    useEffect(() => {
        const gameLoop = (timestamp: number) => {
            if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
            const deltaTime = timestamp - lastUpdateRef.current;

            const state = useGameStore.getState();

            if (state.gameStatus === "PLAYING") {
                state.updateTimePlayed(deltaTime);
                state.updateEnemies();
                state.checkCollisions();

                if (timestamp - lastCollectibleSpawnRef.current > 1500) {
                    state.spawnCollectible();
                    lastCollectibleSpawnRef.current = timestamp;
                }

                if (timestamp - lastEnemySpawnRef.current > 4000) {
                    state.spawnEnemy();
                    lastEnemySpawnRef.current = timestamp;
                }

                if (timestamp - lastPowerUpSpawnRef.current > 8000) {
                    state.spawnPowerUp();
                    lastPowerUpSpawnRef.current = timestamp;
                }
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
