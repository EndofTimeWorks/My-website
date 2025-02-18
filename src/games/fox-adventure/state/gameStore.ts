import { create } from 'zustand';

interface Position {
  x: number;
  y: number;
}

interface PowerUp {
  id: string;
  type: 'SPEED' | 'SHIELD' | 'MAGNET';
  duration: number;
  position: Position;
}

interface Collectible {
  id: string;
  type: 'STAR' | 'GEM' | 'KEY';
  value: number;
  position: Position;
}

interface Enemy {
  id: string;
  type: 'WOLF' | 'OWL' | 'HUNTER';
  position: Position;
  direction: Position;
  speed: number;
}

interface PlayerState {
  position: Position;
  health: number;
  speed: number;
  powerUps: PowerUp[];
  isInvincible: boolean;
  hasKey: boolean;
}

interface GameState {
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
  updateEnemies: () => void;
  collectItem: (itemId: string) => void;
  takeDamage: (amount: number) => void;
  activatePowerUp: (powerUpId: string) => void;
  startNewGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

const useGameStore = create<GameState>((set, get) => ({
  player: {
    position: { x: 50, y: 50 },
    health: 100,
    speed: 5,
    powerUps: [],
    isInvincible: false,
    hasKey: false
  },
  enemies: [],
  collectibles: [],
  powerUps: [],
  score: 0,
  level: 1,
  gameStatus: 'MENU',
  highScores: [],
  timePlayed: 0,

  movePlayer: (direction) => {
    const { player } = get();
    set({
      player: {
        ...player,
        position: {
          x: Math.max(0, Math.min(100, player.position.x + direction.x * player.speed)),
          y: Math.max(0, Math.min(100, player.position.y + direction.y * player.speed))
        }
      }
    });
  },

  updateEnemies: () => {
    const { enemies, player } = get();
    const updatedEnemies = enemies.map(enemy => {
      const dx = player.position.x - enemy.position.x;
      const dy = player.position.y - enemy.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return {
        ...enemy,
        direction: {
          x: dx / distance,
          y: dy / distance
        },
        position: {
          x: enemy.position.x + (enemy.direction.x * enemy.speed),
          y: enemy.position.y + (enemy.direction.y * enemy.speed)
        }
      };
    });

    set({ enemies: updatedEnemies });
  },

  collectItem: (itemId) => {
    const { collectibles, score, player } = get();
    const item = collectibles.find(c => c.id === itemId);
    if (!item) return;

    set({
      collectibles: collectibles.filter(c => c.id !== itemId),
      score: score + item.value
    });
  },

  takeDamage: (amount) => {
    const { player, gameStatus } = get();
    if (player.isInvincible) return;

    const newHealth = player.health - amount;
    set({
      player: {
        ...player,
        health: newHealth
      },
      gameStatus: newHealth <= 0 ? 'GAME_OVER' : gameStatus
    });
  },

  activatePowerUp: (powerUpId) => {
    const { player, powerUps } = get();
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp) return;

    set({
      player: {
        ...player,
        powerUps: [...player.powerUps, powerUp]
      },
      powerUps: powerUps.filter(p => p.id !== powerUpId)
    });

    // Reset power-up after duration
    setTimeout(() => {
      const currentPlayer = get().player;
      set({
        player: {
          ...currentPlayer,
          powerUps: currentPlayer.powerUps.filter(p => p.id !== powerUp.id)
        }
      });
    }, powerUp.duration);
  },

  startNewGame: () => set({
    player: {
      position: { x: 50, y: 50 },
      health: 100,
      speed: 5,
      powerUps: [],
      isInvincible: false,
      hasKey: false
    },
    enemies: [],
    collectibles: [],
    powerUps: [],
    score: 0,
    level: 1,
    gameStatus: 'PLAYING',
    timePlayed: 0
  }),

  pauseGame: () => set({ gameStatus: 'PAUSED' }),
  resumeGame: () => set({ gameStatus: 'PLAYING' })
}));

export default useGameStore;