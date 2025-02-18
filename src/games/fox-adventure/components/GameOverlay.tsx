// src/games/fox-adventure/components/GameOverlay.tsx
import { Play, RotateCcw } from 'lucide-react';
import useGameStore from '../state/gameStore';

export const GameOverlay: React.FC = () => {
  const { gameStatus, score, startNewGame, resumeGame } = useGameStore();

  if (gameStatus === 'PLAYING') return null;

  return (
    <div className="absolute inset-0 bg-background-primary/80 backdrop-blur-md flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-gradient-card rounded-xl border border-accent-primary/20">
        {gameStatus === 'MENU' && (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-glow">Fox Adventure</h1>
            <p className="text-lg text-text-primary/80">Help the fox collect treasures while avoiding enemies!</p>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Controls:</h2>
              <ul className="text-left space-y-2">
                <li>Move: Arrow keys or WASD</li>
                <li>Pause: ESC</li>
                <li>Collect items to score points</li>
                <li>Find power-ups to gain advantages</li>
                <li>Avoid enemies or find shields</li>
              </ul>
            </div>
            <button
              onClick={startNewGame}
              className="px-8 py-4 bg-accent-primary hover:bg-accent-neon transition-all rounded-lg flex items-center justify-center gap-2 mx-auto group"
            >
              <Play className="w-5 h-5 group-hover:animate-pulse" />
              Start Game
            </button>
          </div>
        )}

        {gameStatus === 'PAUSED' && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-glow">Game Paused</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={resumeGame}
                className="px-6 py-3 bg-accent-primary hover:bg-accent-neon transition-all rounded-lg flex items-center gap-2 group"
              >
                <Play className="w-5 h-5 group-hover:animate-pulse" />
                Resume
              </button>
              <button
                onClick={startNewGame}
                className="px-6 py-3 bg-background-secondary hover:bg-background-secondary/80 transition-all rounded-lg flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Restart
              </button>
            </div>
          </div>
        )}

        {gameStatus === 'GAME_OVER' && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-red-500">Game Over</h2>
            <div className="space-y-2">
              <p className="text-xl">Final Score:</p>
              <p className="text-4xl font-bold text-accent-neon">{score.toLocaleString()}</p>
            </div>
            <button
              onClick={startNewGame}
              className="px-8 py-4 bg-accent-primary hover:bg-accent-neon transition-all rounded-lg flex items-center justify-center gap-2 mx-auto group"
            >
              <RotateCcw className="w-5 h-5 group-hover:animate-pulse" />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};