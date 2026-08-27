import useGameStore from "../state/gameStore";
import { Heart, Star, Timer, Trophy, Zap, Shield } from "lucide-react";

export const GameHUD: React.FC = () => {
    const player = useGameStore((state) => state.player);
    const score = useGameStore((state) => state.score);
    const level = useGameStore((state) => state.level);
    const timePlayed = useGameStore((state) => state.timePlayed);
    const highScores = useGameStore((state) => state.highScores);

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
    };

    const bestScore = highScores.length > 0 ? Math.max(...highScores) : 0;
    const getPowerUpIcon = (type: string) => {
        switch (type) {
            case "SPEED":
                return <Zap className="w-4 h-4 text-yellow-400" />;
            case "SHIELD":
                return <Shield className="w-4 h-4 text-blue-400" />;
            default:
                return <Star className="w-4 h-4 text-purple-400" />;
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
            <div className="space-y-4">
                <div className="flex items-center gap-2 bg-background-primary/50 p-2 rounded-lg backdrop-blur-sm">
                    <Heart
                        className={`w-6 h-6 ${
                            player.health > 20
                                ? "text-red-500"
                                : "text-red-500 animate-pulse"
                        }`}
                    />
                    <div className="w-32 h-3 bg-background-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500 transition-all duration-300"
                            style={{ width: `${player.health}%` }}
                        />
                    </div>
                    <span className="text-sm text-white/80">
                        {player.health}%
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {player.powerUps.length > 0 ? (
                        player.powerUps.map((powerUp) => (
                            <div
                                key={powerUp.id}
                                className="flex items-center gap-1.5 rounded-lg bg-background-primary/50 p-2 backdrop-blur-sm"
                            >
                                {getPowerUpIcon(powerUp.type)}
                                <span className="text-xs">{powerUp.type}</span>
                                <span className="min-w-7 rounded bg-background-secondary/70 px-1.5 py-0.5 text-center text-[10px] text-white/80">
                                    {Math.max(
                                        0,
                                        Math.ceil(
                                            (powerUp.expiresAt - timePlayed) /
                                                1000,
                                        ),
                                    )}
                                    s
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-lg bg-background-primary/40 px-2 py-1 text-xs text-white/60 backdrop-blur-sm">
                            No active power-ups
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute left-1/2 top-4 -translate-x-1/2 text-center">
                <div className="bg-background-primary/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-accent-neon">
                        Level {level}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-xl">
                            {score.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 text-right">
                <div className="bg-background-primary/50 p-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                    <Timer className="w-5 h-5 text-accent-primary" />
                    <span>{formatTime(timePlayed)}</span>
                </div>
                <div className="bg-background-primary/50 p-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span>Best: {bestScore.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};
