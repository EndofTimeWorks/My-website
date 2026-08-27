import { create } from "zustand";
import type {
    ActivePowerUp,
    GameState,
    Position,
    Collectible,
    Enemy,
    PowerUp,
} from "@/types/game";

const BASE_PLAYER_SPEED = 45;
const COLLISION_DISTANCE = 6;
const POWER_UP_DURATION_MS = 5000;
const DAMAGE_COOLDOWN_MS = 1500;
const DAMAGE_FLASH_MS = 350;
const PLAYFIELD_MIN = 10;
const PLAYFIELD_MAX = 90;
const ENEMY_EDGE_MIN = 4;
const ENEMY_EDGE_MAX = 96;

const randomPlayfieldPosition = (): Position => ({
    x: Math.random() * (PLAYFIELD_MAX - PLAYFIELD_MIN) + PLAYFIELD_MIN,
    y: Math.random() * (PLAYFIELD_MAX - PLAYFIELD_MIN) + PLAYFIELD_MIN,
});

const createInitialPlayer = () => ({
    position: { x: 50, y: 50 },
    health: 100,
    speed: BASE_PLAYER_SPEED,
    powerUps: [],
    isInvincible: false,
    damageCooldownUntil: 0,
    damageFlashUntil: 0,
});

const applyPlayerEffects = (
    player: {
        position: Position;
        health: number;
        speed: number;
        powerUps: ActivePowerUp[];
        isInvincible: boolean;
        damageCooldownUntil: number;
        damageFlashUntil: number;
    },
    now: number,
) => {
    const activePowerUps = player.powerUps.filter(
        (powerUp) => powerUp.expiresAt > now,
    );
    const hasShield = activePowerUps.some((powerUp) => powerUp.type === "SHIELD");
    const speedBoosts = activePowerUps.filter(
        (powerUp) => powerUp.type === "SPEED",
    ).length;

    return {
        ...player,
        powerUps: activePowerUps,
        speed: BASE_PLAYER_SPEED * Math.pow(1.5, speedBoosts),
        isInvincible: hasShield || player.damageCooldownUntil > now,
        damageFlashUntil:
            player.damageFlashUntil > now ? player.damageFlashUntil : 0,
    };
};

const createCollectible = (): Collectible => {
    const isGem = Math.random() > 0.7;

    return {
        id: `collectible-${Date.now()}-${Math.random()}`,
        type: isGem ? "GEM" : "STAR",
        value: isGem ? 25 : 10,
        position: randomPlayfieldPosition(),
    };
};

const createEnemy = (level: number): Enemy => {
    const side = Math.floor(Math.random() * 4);
    let x: number, y: number;

    switch (side) {
        case 0:
            x =
                Math.random() * (ENEMY_EDGE_MAX - ENEMY_EDGE_MIN) +
                ENEMY_EDGE_MIN;
            y = ENEMY_EDGE_MIN;
            break;
        case 1:
            x = ENEMY_EDGE_MAX;
            y =
                Math.random() * (ENEMY_EDGE_MAX - ENEMY_EDGE_MIN) +
                ENEMY_EDGE_MIN;
            break;
        case 2:
            x =
                Math.random() * (ENEMY_EDGE_MAX - ENEMY_EDGE_MIN) +
                ENEMY_EDGE_MIN;
            y = ENEMY_EDGE_MAX;
            break;
        default:
            x = ENEMY_EDGE_MIN;
            y =
                Math.random() * (ENEMY_EDGE_MAX - ENEMY_EDGE_MIN) +
                ENEMY_EDGE_MIN;
            break;
    }

    const enemyTypes: Array<"WOLF" | "OWL" | "HUNTER"> = [
        "WOLF",
        "OWL",
        "HUNTER",
    ];

    return {
        id: `enemy-${Date.now()}-${Math.random()}`,
        type: enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
        position: { x, y },
        direction: { x: 0, y: 0 },
        speed: 14 + Math.random() * 8 + level * 1.5,
    };
};

const createPowerUp = (): PowerUp => {
    const types: Array<"SPEED" | "SHIELD"> = ["SPEED", "SHIELD"];

    return {
        id: `powerup-${Date.now()}-${Math.random()}`,
        type: types[Math.floor(Math.random() * types.length)],
        duration: POWER_UP_DURATION_MS,
        position: randomPlayfieldPosition(),
    };
};

const useGameStore = create<GameState>((set, get) => ({
    player: createInitialPlayer(),
    enemies: [],
    collectibles: [],
    powerUps: [],
    score: 0,
    level: 1,
    gameStatus: "MENU",
    highScores: [0],
    timePlayed: 0,

    movePlayer: (direction: Position, deltaSeconds: number) => {
        const { player } = get();
        const distance = player.speed * deltaSeconds;

        set({
            player: {
                ...player,
                position: {
                    x: Math.max(
                        2,
                        Math.min(98, player.position.x + direction.x * distance),
                    ),
                    y: Math.max(
                        2,
                        Math.min(98, player.position.y + direction.y * distance),
                    ),
                },
            },
        });
    },

    updateEnemies: (deltaSeconds: number) => {
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
                            enemy.position.x +
                                newDirection.x * enemy.speed * deltaSeconds,
                        ),
                    ),
                    y: Math.max(
                        0,
                        Math.min(
                            100,
                            enemy.position.y +
                                newDirection.y * enemy.speed * deltaSeconds,
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
        const { player, gameStatus, score, highScores, timePlayed } = get();
        if (player.isInvincible) return;

        const newHealth = Math.max(0, player.health - amount);
        const isGameOver = newHealth <= 0;

        set({
            player: {
                ...player,
                health: newHealth,
                isInvincible: true,
                damageCooldownUntil: timePlayed + DAMAGE_COOLDOWN_MS,
                damageFlashUntil: timePlayed + DAMAGE_FLASH_MS,
            },
            gameStatus: isGameOver ? "GAME_OVER" : gameStatus,
            highScores: isGameOver
                ? [...highScores, score].sort((a, b) => b - a).slice(0, 5)
                : highScores,
        });

        if (!isGameOver) {
            set({ player: applyPlayerEffects(get().player, timePlayed) });
        }
    },

    activatePowerUp: (powerUpId: string) => {
        const { player, powerUps, timePlayed } = get();
        const powerUp = powerUps.find((p) => p.id === powerUpId);
        if (!powerUp) return;
        const activePowerUp: ActivePowerUp = {
            ...powerUp,
            expiresAt: timePlayed + powerUp.duration,
        };

        const updatedPlayer = applyPlayerEffects({
            ...player,
            powerUps: [...player.powerUps, activePowerUp],
        }, timePlayed);

        set({
            player: updatedPlayer,
            powerUps: powerUps.filter((p) => p.id !== powerUpId),
        });

    },

    startNewGame: () =>
        set({
            player: createInitialPlayer(),
            enemies: [createEnemy(1), createEnemy(1)],
            collectibles: Array.from({ length: 5 }, createCollectible),
            powerUps: [createPowerUp()],
            score: 0,
            level: 1,
            gameStatus: "PLAYING",
            timePlayed: 0,
        }),

    showMenu: () =>
        set({
            player: createInitialPlayer(),
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

        set({ collectibles: [...collectibles, createCollectible()] });
    },

    spawnEnemy: () => {
        const { enemies, level } = get();
        const maxEnemies = Math.min(3 + level, 8);
        if (enemies.length >= maxEnemies) return;

        set({ enemies: [...enemies, createEnemy(level)] });
    },

    spawnPowerUp: () => {
        const { powerUps } = get();
        if (powerUps.length >= 2) return;

        set({ powerUps: [...powerUps, createPowerUp()] });
    },

    updateTimePlayed: (delta: number) => {
        const { timePlayed, score, level, player } = get();
        const newTime = timePlayed + delta;

        const newLevel = Math.floor(score / 100) + 1;

        set({
            player: applyPlayerEffects(player, newTime),
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
