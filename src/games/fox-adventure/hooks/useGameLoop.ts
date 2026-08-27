import { useEffect, type RefObject } from "react";
import useGameStore from "../state/gameStore";

interface Direction {
    x: number;
    y: number;
}

const getMovementDirection = (keys: Set<string>): Direction => {
    const direction = { x: 0, y: 0 };

    if (keys.has("arrowup") || keys.has("w")) direction.y -= 1;
    if (keys.has("arrowdown") || keys.has("s")) direction.y += 1;
    if (keys.has("arrowleft") || keys.has("a")) direction.x -= 1;
    if (keys.has("arrowright") || keys.has("d")) direction.x += 1;

    if (direction.x === 0 && direction.y === 0) {
        return direction;
    }

    const magnitude = Math.sqrt(
        direction.x * direction.x + direction.y * direction.y,
    );

    return {
        x: direction.x / magnitude,
        y: direction.y / magnitude,
    };
};

export const useGameLoop = (keysRef: RefObject<Set<string>>) => {
    useEffect(() => {
        let frameId = 0;
        let lastUpdate = 0;
        let lastCollectibleSpawn = 0;
        let lastEnemySpawn = 0;
        let lastPowerUpSpawn = 0;

        const gameLoop = (timestamp: number) => {
            if (!lastUpdate) {
                lastUpdate = timestamp;
            }

            const deltaTime = timestamp - lastUpdate;
            const deltaSeconds = Math.min(deltaTime / 1000, 0.05);
            const state = useGameStore.getState();

            if (state.gameStatus === "PLAYING") {
                const direction = getMovementDirection(keysRef.current);

                if (direction.x !== 0 || direction.y !== 0) {
                    state.movePlayer(direction, deltaSeconds);
                }

                state.updateTimePlayed(deltaTime);
                state.updateEnemies(deltaSeconds);
                state.checkCollisions();

                if (timestamp - lastCollectibleSpawn > 1500) {
                    state.spawnCollectible();
                    lastCollectibleSpawn = timestamp;
                }

                if (timestamp - lastEnemySpawn > 4000) {
                    state.spawnEnemy();
                    lastEnemySpawn = timestamp;
                }

                if (timestamp - lastPowerUpSpawn > 8000) {
                    state.spawnPowerUp();
                    lastPowerUpSpawn = timestamp;
                }
            }

            lastUpdate = timestamp;
            frameId = requestAnimationFrame(gameLoop);
        };

        frameId = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(frameId);
    }, [keysRef]);
};
