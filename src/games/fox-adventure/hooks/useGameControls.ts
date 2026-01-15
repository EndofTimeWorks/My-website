import { useEffect } from "react";
import useGameStore from "../state/gameStore";

export const useGameControls = () => {
    useEffect(() => {
        const keys = new Set<string>();

        const handleKeyDown = (e: KeyboardEvent) => {
            keys.add(e.key.toLowerCase());

            if (e.key === "Escape") {
                const state = useGameStore.getState();
                if (state.gameStatus === "PLAYING") {
                    state.pauseGame();
                } else if (state.gameStatus === "PAUSED") {
                    state.resumeGame();
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keys.delete(e.key.toLowerCase());
        };

        const updatePlayerMovement = () => {
            const state = useGameStore.getState();
            if (state.gameStatus !== "PLAYING") return;

            const direction = { x: 0, y: 0 };

            if (keys.has("arrowup") || keys.has("w")) direction.y -= 1;
            if (keys.has("arrowdown") || keys.has("s")) direction.y += 1;
            if (keys.has("arrowleft") || keys.has("a")) direction.x -= 1;
            if (keys.has("arrowright") || keys.has("d")) direction.x += 1;

            if (direction.x !== 0 || direction.y !== 0) {
                const magnitude = Math.sqrt(
                    direction.x * direction.x + direction.y * direction.y,
                );
                direction.x /= magnitude;
                direction.y /= magnitude;

                state.movePlayer(direction);
            }
        };

        let animationFrameId: number;
        const gameLoop = () => {
            updatePlayerMovement();
            animationFrameId = requestAnimationFrame(gameLoop);
        };
        animationFrameId = requestAnimationFrame(gameLoop);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
};
