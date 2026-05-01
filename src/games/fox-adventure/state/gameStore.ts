import { create } from "zustand";
import type {
    GameState,
    Position,
    Collectible,
    Enemy,
    PowerUp,
} from "@/types/game";

const COLLISION_DISTANCE = 5;

const useGameStore = create<GameState>((set, get) => ({
    player: {
        position: { x: 50, y: 50 },
        health: 100,
        speed: 0.8,
        powerUps: [],
        isInvincible: false,
        hasKey: false,
    },
    enemies: [],
    collectibles: [],
    powerUps: [],
    score: 0,
    level: 1,
    gameStatus: "MENU",
    highScores: [0],
    timePlayed: 0,

    movePlayer: (direction: Position) => {
        const { player } = get();
        set({
            player: {
                ...player,
                position: {
                    x: Math.max(
                        2,
                        Math.min(
                            98,
                            player.position.x + direction.x * player.speed,
                        ),
                    ),
                    y: Math.max(
                        2,
                        Math.min(
                            98,
                            player.position.y + direction.y * player.speed,
                        ),
                    ),
                },
            },
        });
    },

    updateEnemies: () => {
        const { enemies, player } = get();
        if (enemies.length === 0) return;

        const updatedEnemies = enemies.map((enemy) => {
            const dx = player.position.x - enemy.position.x;
            const dy = player.position.y - enemy.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance === 0) return enemy;

            const newDirection = {
                x: dx / distance,
                y: dy / distance,
            };

            return {
                ...enemy,
                direction: newDirection,
                position: {
                    x: Math.max(
                        0,
                        Math.min(
                            100,
                            enemy.position.x + newDirection.x * enemy.speed,
                        ),
                    ),
                    y: Math.max(
                        0,
                        Math.min(
                            100,
                            enemy.position.y + newDirection.y * enemy.speed,
                        ),
                    ),
                },
            };
        });

        set({ enemies: updatedEnemies });
    },

    collectItem: (itemId: string) => {
        const { collectibles, score } = get();
        const item = collectibles.find((c) => c.id === itemId);
        if (!item) return;

        set({
            collectibles: collectibles.filter((c) => c.id !== itemId),
            score: score + item.value,
        });
    },

    takeDamage: (amount: number) => {
        const { player, gameStatus, score, highScores } = get();
        if (player.isInvincible) return;

        const newHealth = Math.max(0, player.health - amount);
        const isGameOver = newHealth <= 0;

        set({
            player: {
                ...player,
                health: newHealth,
                isInvincible: true,
            },
            gameStatus: isGameOver ? "GAME_OVER" : gameStatus,
            highScores: isGameOver
                ? [...highScores, score].sort((a, b) => b - a).slice(0, 5)
                : highScores,
        });

        if (!isGameOver) {
            setTimeout(() => {
                const currentPlayer = get().player;
                set({
                    player: {
                        ...currentPlayer,
                        isInvincible: false,
                    },
                });
            }, 1500);
        }
    },

    activatePowerUp: (powerUpId: string) => {
        const { player, powerUps } = get();
        const powerUp = powerUps.find((p) => p.id === powerUpId);
        if (!powerUp) return;

        const updatedPlayer = {
            ...player,
            powerUps: [...player.powerUps, powerUp],
        };

        if (powerUp.type === "SHIELD") {
            updatedPlayer.isInvincible = true;
        } else if (powerUp.type === "SPEED") {
            updatedPlayer.speed = player.speed * 1.5;
        }

        set({
            player: updatedPlayer,
            powerUps: powerUps.filter((p) => p.id !== powerUpId),
        });

        setTimeout(() => {
            const currentPlayer = get().player;
            const resetPlayer = {
                ...currentPlayer,
                powerUps: currentPlayer.powerUps.filter(
                    (p) => p.id !== powerUp.id,
                ),
            };

            if (powerUp.type === "SHIELD") {
                resetPlayer.isInvincible = false;
            } else if (powerUp.type === "SPEED") {
                resetPlayer.speed = 0.8;
            }

            set({ player: resetPlayer });
        }, powerUp.duration);
    },

    startNewGame: () =>
        set({
            player: {
                position: { x: 50, y: 50 },
                health: 100,
                speed: 0.8,
                powerUps: [],
                isInvincible: false,
                hasKey: false,
            },
            enemies: [],
            collectibles: [],
            powerUps: [],
            score: 0,
            level: 1,
            gameStatus: "PLAYING",
            timePlayed: 0,
        }),

    showMenu: () =>
        set({
            player: {
                position: { x: 50, y: 50 },
                health: 100,
                speed: 0.8,
                powerUps: [],
                isInvincible: false,
                hasKey: false,
            },
            enemies: [],
            collectibles: [],
            powerUps: [],
            score: 0,
            level: 1,
            gameStatus: "MENU",
            timePlayed: 0,
        }),

    pauseGame: () => set({ gameStatus: "PAUSED" }),
    resumeGame: () => set({ gameStatus: "PLAYING" }),

    spawnCollectible: () => {
        const { collectibles } = get();
        if (collectibles.length >= 10) return;

        const isGem = Math.random() > 0.7;
        const collectible: Collectible = {
            id: `collectible-${Date.now()}-${Math.random()}`,
            type: isGem ? "GEM" : "STAR",
            value: isGem ? 25 : 10,
            position: {
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
            },
        };

        set({ collectibles: [...collectibles, collectible] });
    },

    spawnEnemy: () => {
        const { enemies, level } = get();
        const maxEnemies = Math.min(3 + level, 8);
        if (enemies.length >= maxEnemies) return;

        const side = Math.floor(Math.random() * 4);
        let x: number, y: number;

        switch (side) {
            case 0:
                x = Math.random() * 100;
                y = 0;
                break;
            case 1:
                x = 100;
                y = Math.random() * 100;
                break;
            case 2:
                x = Math.random() * 100;
                y = 100;
                break;
            default:
                x = 0;
                y = Math.random() * 100;
                break;
        }

        const enemyTypes: Array<"WOLF" | "OWL" | "HUNTER"> = [
            "WOLF",
            "OWL",
            "HUNTER",
        ];
        const enemy: Enemy = {
            id: `enemy-${Date.now()}-${Math.random()}`,
            type: enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
            position: { x, y },
            direction: { x: 0, y: 0 },
            speed: 0.15 + Math.random() * 0.1 + level * 0.02,
        };

        set({ enemies: [...enemies, enemy] });
    },

    spawnPowerUp: () => {
        const { powerUps } = get();
        if (powerUps.length >= 2) return;

        const types: Array<"SPEED" | "SHIELD" | "MAGNET"> = [
            "SPEED",
            "SHIELD",
            "MAGNET",
        ];
        const powerUp: PowerUp = {
            id: `powerup-${Date.now()}-${Math.random()}`,
            type: types[Math.floor(Math.random() * types.length)],
            duration: 5000,
            position: {
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
            },
        };

        set({ powerUps: [...powerUps, powerUp] });
    },

    updateTimePlayed: (delta: number) => {
        const { timePlayed, score, level } = get();
        const newTime = timePlayed + delta;

        const newLevel = Math.floor(score / 100) + 1;

        set({
            timePlayed: newTime,
            level: Math.max(level, newLevel),
        });
    },

    checkCollisions: () => {
        const { player, enemies, collectibles, powerUps } = get();
        const store = get();

        enemies.forEach((enemy) => {
            const dx = player.position.x - enemy.position.x;
            const dy = player.position.y - enemy.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < COLLISION_DISTANCE) {
                store.takeDamage(20);
            }
        });

        collectibles.forEach((collectible) => {
            const dx = player.position.x - collectible.position.x;
            const dy = player.position.y - collectible.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < COLLISION_DISTANCE) {
                store.collectItem(collectible.id);
            }
        });

        powerUps.forEach((powerUp) => {
            const dx = player.position.x - powerUp.position.x;
            const dy = player.position.y - powerUp.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < COLLISION_DISTANCE) {
                store.activatePowerUp(powerUp.id);
            }
        });
    },
}));

export default useGameStore;
