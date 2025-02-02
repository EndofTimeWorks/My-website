import { useState, useEffect } from 'react';
import { Music, Loader } from 'lucide-react';

const playlists = [
    "58ggvvTcs95yhcSeSxLGks",  // Playlist 1
    "6e2q3GgjEDxMWJBSln2Py5"   // Playlist 2
];

const MusicDisplay = () => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRandomPlaylist = () => playlists[Math.floor(Math.random() * playlists.length)];
        
        const updateTrack = async () => {
            setLoading(true);
            const playlist = getRandomPlaylist();
            setCurrentTrack({ 
                name: "Music from Playlist",
                artist: "Current Mix"
            });
            setLoading(false);
        };

        updateTrack();
        const interval = setInterval(updateTrack, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <Loader size={20} className="animate-spin" />
                <span>Loading music...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 p-4 bg-background-secondary/50 rounded-lg">
            <div className="relative w-8 h-8">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bottom-0 w-2 bg-accent-neon animate-float"
                        style={{
                            left: `${i * 12}px`,
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.2}s`
                        }}
                    />
                ))}
            </div>
            <div>
                <p className="font-medium">{currentTrack?.name}</p>
                <p className="text-sm opacity-80">{currentTrack?.artist}</p>
            </div>
        </div>
    );
};

export default MusicDisplay;
