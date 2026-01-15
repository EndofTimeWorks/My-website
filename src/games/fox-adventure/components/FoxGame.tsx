import { useEffect } from "react";
import useGameStore from "../state/gameStore";
import { useGameLoop } from "../hooks/useGameLoop";
import { useGameControls } from "../hooks/useGameControls";
import { Player } from "./Player";
import { GameHUD } from "./GameHUD";
import { GameOverlay } from "./GameOverlay";

const FoxGame: React.FC = () => {
    const gameStatus = useGameStore((state) => state.gameStatus);
    const collectibles = useGameStore((state) => state.collectibles);
    const enemies = useGameStore((state) => state.enemies);
    const powerUps = useGameStore((state) => state.powerUps);
    const startNewGame = useGameStore((state) => state.startNewGame);

    useGameLoop();
    useGameControls();

    useEffect(() => {
        if (gameStatus === "MENU") {
            startNewGame();
        }
    }, [gameStatus, startNewGame]);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-background-primary to-background-secondary z-50">
            <div className="relative w-full h-full overflow-hidden game-viewport">
                {/* Game world */}
                <div className="absolute inset-0">
                    <Player />

                    {/* Render collectibles */}
                    {collectibles.map((collectible) => (
                        <div
                            key={collectible.id}
                            className={`absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse ${
                                collectible.type === "GEM"
                                    ? "bg-purple-500"
                                    : "bg-yellow-400"
                            }`}
                            style={{
                                left: `${collectible.position.x}%`,
                                top: `${collectible.position.y}%`,
                            }}
                        />
                    ))}

                    {/* Render enemies */}
                    {enemies.map((enemy) => (
                        <div
                            key={enemy.id}
                            className="absolute w-6 h-6 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${enemy.position.x}%`,
                                top: `${enemy.position.y}%`,
                            }}
                        />
                    ))}

                    {/* Render power-ups */}
                    {powerUps.map((powerUp) => (
                        <div
                            key={powerUp.id}
                            className="absolute w-8 h-8 bg-accent-neon rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-float"
                            style={{
                                left: `${powerUp.position.x}%`,
                                top: `${powerUp.position.y}%`,
                            }}
                        />
                    ))}
                </div>

                {/* HUD and Overlay */}
                <GameHUD />
                <GameOverlay />
            </div>
        </div>
    );
};

export default FoxGame;
