import { Heart, Gamepad2, Code, Music } from 'lucide-react';
import FoxCard from '@/components/FoxCard';
import SpotifyVisualizer from '@/components/SpotifyVisualizer';
import useSpotifyData from '@/hooks/useSpotifyData';

const AboutPage = () => {
    const { data: spotifyData, loading } = useSpotifyData();

    const calculateAge = (): number => {
        const birthDate = new Date("2009-05-15");
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="page-container">
            <FoxCard className="header-card">
                <h1 className="text-glow">About Me</h1>
                <p className="text-gradient">
                    Transfem Foxgirl • {calculateAge()} years old • Programmer & Streamer
                </p>
            </FoxCard>

            <div className="content-grid">
                <FoxCard>
                    <div className="flex items-center gap-4">
                        <Code size={24} className="text-accent-primary" />
                        <h2>Tech Interests</h2>
                    </div>
                    <ul className="interest-list">
                        <li>Programming & Development</li>
                        <li>Robotics & Hardware</li>
                        <li>Cybersecurity</li>
                    </ul>
                </FoxCard>

                <FoxCard>
                    <div className="flex items-center gap-4">
                        <Gamepad2 size={24} className="text-accent-primary" />
                        <h2>Streaming</h2>
                    </div>
                    <p>
                        Find me on{' '}
                        <a 
                            href="https://twitch.tv/EndofTimee" 
                            className="text-accent-neon hover:text-glow"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Twitch
                        </a>
                        {' '}playing FiveM and other games!
                    </p>
                </FoxCard>

                <FoxCard>
                    <div className="flex items-center gap-4">
                        <Music size={24} className="text-accent-primary" />
                        <h2>Current Tunes</h2>
                    </div>
                    <SpotifyVisualizer isPlaying={!loading && !!spotifyData} />
                </FoxCard>
            </div>
        </div>
    );
};

export default AboutPage;
