export interface Position {
    x: number;
    y: number;
}

export interface PowerUp {
    id: string;
    type: "SPEED" | "SHIELD";
    duration: number;
    position: Position;
}

export interface ActivePowerUp extends PowerUp {
    expiresAt: number;
}

export interface Collectible {
    id: string;
    type: "STAR" | "GEM";
    value: number;
    position: Position;
}

export interface Enemy {
    id: string;
    type: "WOLF" | "OWL" | "HUNTER";
    position: Position;
    direction: Position;
    speed: number;
}

export interface PlayerState {
    position: Position;
    health: number;
    speed: number;
    powerUps: ActivePowerUp[];
    isInvincible: boolean;
    damageCooldownUntil: number;
    damageFlashUntil: number;
}

export interface GameState {
    player: PlayerState;
    enemies: Enemy[];
    collectibles: Collectible[];
    powerUps: PowerUp[];
    score: number;
    level: number;
    gameStatus: "MENU" | "PLAYING" | "PAUSED" | "GAME_OVER";
    highScores: number[];
    timePlayed: number;

    // Actions
    movePlayer: (direction: Position, deltaSeconds: number) => void;
    updateEnemies: (deltaSeconds: number) => void;
    collectItem: (itemId: string) => void;
    takeDamage: (amount: number) => void;
    activatePowerUp: (powerUpId: string) => void;
    startNewGame: () => void;
    showMenu: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    spawnCollectible: () => void;
    spawnEnemy: () => void;
    spawnPowerUp: () => void;
    updateTimePlayed: (delta: number) => void;
    checkCollisions: () => void;
}
