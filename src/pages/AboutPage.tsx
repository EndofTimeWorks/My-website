import { Gamepad2, Code, Music } from 'lucide-react';
import { useState, useEffect } from 'react';
import FoxCard from '@/components/FoxCard';
import MusicDisplay from '@/components/MusicDisplay';
import { calculatePreciseAge } from '@/utils/dateUtils';

const AboutPage = () => {
    const [age, setAge] = useState(calculatePreciseAge(new Date("2009-05-15")));

    useEffect(() => {
        const interval = setInterval(() => {
            setAge(calculatePreciseAge(new Date("2009-05-15")));
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="page-container">
            <FoxCard className="header-card">
                <h1 className="text-glow">About Me</h1>
                <p className="text-gradient">
                    End • ProtoFoxes • They/Them • {age} years old • Programmer & Streamer
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
                    <div className="flex items-center gap-4 mb-4">
                        <Music size={24} className="text-accent-primary" />
                        <h2>Music</h2>
                    </div>
                    <MusicDisplay />
                </FoxCard>
            </div>
        </div>
    );
};

export default AboutPage;