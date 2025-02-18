export interface PowerUp {
  id: string;
  type: 'SPEED' | 'SHIELD' | 'MAGNET';
  duration: number;
  position: { x: number; y: number };
}

export interface Collectible {
  id: string;
  type: 'STAR' | 'GEM' | 'KEY';
  value: number;
  position: { x: number; y: number };
}

export interface Enemy {
  id: string;
  type: 'WOLF' | 'OWL' | 'HUNTER';
  position: { x: number; y: number };
  direction: { x: number; y: number };
  speed: number;
}

export interface PlayerState {
  position: { x: number; y: number };
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
}
