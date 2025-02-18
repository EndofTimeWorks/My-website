export interface Position {
  x: number;
  y: number;
}

export interface PowerUp {
  id: string;
  type: 'SPEED' | 'SHIELD' | 'MAGNET';
  duration: number;
  position: Position;
}

export interface Collectible {
  id: string;
  type: 'STAR' | 'GEM' | 'KEY';
  value: number;
  position: Position;
}

export interface Enemy {
  id: string;
  type: 'WOLF' | 'OWL' | 'HUNTER';
  position: Position;
  direction: Position;
  speed: number;
}

export interface PlayerState {
  position: Position;
  health: number;
  speed: number;
  powerUps: PowerUp[];
  isInvincible: boolean;
  hasKey: boolean;
}

export interface GameState {
  player: PlayerState;
  enemies: Enemy[];
  collectibles: Collectible[];
  powerUps: PowerUp[];
  score: number;
  level: number;
  gameStatus: 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
  highScores: number[];
  timePlayed: number;

  // Actions
  movePlayer: (direction: Position) => void;
  updateEnemies: (deltaTime?: number) => void;
  collectItem: (itemId: string) => void;
  takeDamage: (amount: number) => void;
  activatePowerUp: (powerUpId: string) => void;
  startNewGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}