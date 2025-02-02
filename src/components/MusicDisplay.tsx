import { useState, useEffect } from "react";
import { Music, Loader } from "lucide-react";

interface Track {
    name: string;
    artist: string;
    playlistId?: string;
}

const PLAYLISTS = [
    "58ggvvTcs95yhcSeSxLGks",
    "6e2q3GgjEDxMWJBSln2Py5"
];

const MusicDisplay = () => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRandomPlaylist = () => PLAYLISTS[Math.floor(Math.random() * PLAYLISTS.length)];
        
        const updateTrack = async () => {
            try {
                setLoading(true);
                const playlistId = getRandomPlaylist();
                
                const track: Track = { 
                    name: "Music from Playlist",
                    artist: "Current Mix",
                    playlistId
                };
                
                setCurrentTrack(track);
            } catch (error) {
                console.error("Failed to update track:", error);
                setCurrentTrack(null);
            } finally {
                setLoading(false);
            }
        };

        updateTrack();
        const interval = setInterval(updateTrack, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-3 p-4">
                <Loader size={20} className="animate-spin" />
                <span>Loading music...</span>
            </div>
        );
    }

    if (!currentTrack) {
        return (
            <div className="flex items-center gap-3 p-4">
                <Music size={20} className="text-accent-primary" />
                <span>No track available</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-6 p-6 bg-background-secondary/50 rounded-lg">
            <div className="relative w-10 h-10">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bottom-0 w-2 bg-accent-neon animate-float"
                        style={{
                            left: `${i * 14}px`,
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.2}s`
                        }}
                    />
                ))}
            </div>
            <div className="space-y-2">
                <p className="font-medium text-lg">{currentTrack.name}</p>
                <p className="text-sm opacity-80">{currentTrack.artist}</p>
            </div>
        </div>
    );
};

export default MusicDisplay;
