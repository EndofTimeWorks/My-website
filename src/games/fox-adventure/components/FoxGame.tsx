import { useEffect } from "react";
import { Crosshair, Gem, Shield, Skull, Star, Zap } from "lucide-react";
import useGameStore from "../state/gameStore";
import { useGameLoop } from "../hooks/useGameLoop";
import { useGameControls } from "../hooks/useGameControls";
import { Player } from "./Player";
import { GameHUD } from "./GameHUD";
import { GameOverlay } from "./GameOverlay";

const getCollectibleIcon = (type: string) =>
    type === "GEM" ? (
        <Gem className="h-4 w-4" />
    ) : (
        <Star className="h-4 w-4 fill-current" />
    );

const getEnemyIcon = (type: string) =>
    type === "HUNTER" ? (
        <Crosshair className="h-4 w-4" />
    ) : (
        <Skull className="h-4 w-4" />
    );

const getPowerUpIcon = (type: string) =>
    type === "SHIELD" ? (
        <Shield className="h-5 w-5" />
    ) : (
        <Zap className="h-5 w-5 fill-current" />
    );

const FoxGame: React.FC = () => {
    const gameStatus = useGameStore((state) => state.gameStatus);
    const collectibles = useGameStore((state) => state.collectibles);
    const enemies = useGameStore((state) => state.enemies);
    const powerUps = useGameStore((state) => state.powerUps);
    const showMenu = useGameStore((state) => state.showMenu);

    const keysRef = useGameControls();
    useGameLoop(keysRef);

    useEffect(() => {
        showMenu();
    }, [showMenu]);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-background-primary to-background-secondary z-50">
            <div className="relative w-full h-full overflow-hidden game-viewport">
                {/* Game world */}
                <div className="game-world absolute inset-0">
                    <Player />

                    {/* Render collectibles */}
                    {collectibles.map((collectible) => (
                        <div
                            key={collectible.id}
                            className={`game-entity game-collectible game-collectible-${collectible.type.toLowerCase()}`}
                            style={{
                                left: `${collectible.position.x}%`,
                                top: `${collectible.position.y}%`,
                            }}
                        >
                            {getCollectibleIcon(collectible.type)}
                        </div>
                    ))}

                    {/* Render enemies */}
                    {enemies.map((enemy) => (
                        <div
                            key={enemy.id}
                            className={`game-entity game-enemy game-enemy-${enemy.type.toLowerCase()}`}
                            style={{
                                left: `${enemy.position.x}%`,
                                top: `${enemy.position.y}%`,
                            }}
                        >
                            {getEnemyIcon(enemy.type)}
                        </div>
                    ))}

                    {/* Render power-ups */}
                    {powerUps.map((powerUp) => (
                        <div
                            key={powerUp.id}
                            className={`game-entity game-power-up game-power-up-${powerUp.type.toLowerCase()}`}
                            style={{
                                left: `${powerUp.position.x}%`,
                                top: `${powerUp.position.y}%`,
                            }}
                        >
                            {getPowerUpIcon(powerUp.type)}
                        </div>
                    ))}
                </div>

                {/* HUD and Overlay */}
                {gameStatus !== "MENU" && <GameHUD />}
                <GameOverlay />
            </div>
        </div>
    );
};

export default FoxGame;
