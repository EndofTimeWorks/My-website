import { useEffect, useRef } from "react";
import useGameStore from "../state/gameStore";

export const useGameControls = () => {
    const keysRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            keysRef.current.add(event.key.toLowerCase());

            if (event.key === "Escape") {
                const state = useGameStore.getState();
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
