import { useEffect, useRef } from "react";
import useGameStore from "../state/gameStore";

const GAME_KEYS = new Set([
    "arrowup",
    "arrowdown",
    "arrowleft",
    "arrowright",
    "w",
    "a",
    "s",
    "d",
    "escape",
]);

export const useGameControls = () => {
    const keysRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const state = useGameStore.getState();

            if (
                GAME_KEYS.has(key) &&
                (state.gameStatus === "PLAYING" || state.gameStatus === "PAUSED")
            ) {
                event.preventDefault();
            }

            keysRef.current.add(key);

            if (event.key === "Escape") {
                if (state.gameStatus === "PLAYING") {
                    state.pauseGame();
                } else if (state.gameStatus === "PAUSED") {
                    state.resumeGame();
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            keysRef.current.delete(event.key.toLowerCase());
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return keysRef;
};
