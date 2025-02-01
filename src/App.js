import React, { useEffect, useState } from 'react';
import './styles/App.css';
import SpotifyList from './components/SpotifyList';
import LoadingAnimation from './components/LoadingAnimation';
import GithubRepos from './components/GithubRepos';
import { Music, Code, Twitch, Github, Cpu, Shield } from 'lucide-react';

const App = () => {
    const [age, setAge] = useState(0);

    useEffect(() => {
        // Age calculation
        const calculateAge = () => {
            const birthDate = new Date('2009-05-15');
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };
        setAge(calculateAge());

        // Particle effect setup
        const createParticles = () => {
            const particleContainer = document.querySelector('.particle-container');
            if (particleContainer) {
                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = `${Math.random() * 100}vw`;
                    particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
                    particle.style.animationDelay = `${Math.random() * 2}s`;
                    particleContainer.appendChild(particle);
                }
            }
        };

        createParticles();
    }, []);

    const interests = [
        { icon: <Code size={24} />, title: 'Programming', description: 'Full-stack development & coding projects' },
        { icon: <Cpu size={24} />, title: 'Robotics', description: 'Building & programming robots' },
        { icon: <Shield size={24} />, title: 'Cybersecurity', description: 'Network security & ethical hacking' },
        { icon: <Music size={24} />, title: 'Music', description: 'Music production & listening' },
        { icon: <Twitch size={24} />, title: 'Streaming', description: 'FiveM & variety gaming on Twitch' },
        { icon: <Github size={24} />, title: 'Open Source', description: 'Contributing to GitHub projects' }
    ];

    return (
        <div className="app-container animated-bg">
            <div className="particle-container" />
            
            {/* Header Section */}
            <header className="header neon-text">
                <h1>EndofTimee</h1>
                <p className="subtitle">Programmer • Streamer • Foxgirl 🦊</p>
            </header>

            {/* About Section */}
            <section className="content-section about-section">
                <h2 className="neon-text">About Me</h2>
                <div className="about-content">
                    <p>Hey there! I'm a {age}-year-old transfem programmer and content creator. 
                    When I'm not coding or building robots, you can find me streaming on 
                    <a href="https://twitch.tv/EndofTimee" target="_blank" rel="noopener noreferrer" 
                       className="twitch-link">Twitch</a>!</p>
                </div>
            </section>

            {/* Interests Grid */}
            <section className="content-section interests-section">
                <h2 className="neon-text">What I Do</h2>
                <div className="interests-grid">
                    {interests.map((interest, index) => (
                        <div key={index} className="interest-card">
                            <div className="interest-icon">{interest.icon}</div>
                            <h3>{interest.title}</h3>
                            <p>{interest.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Streaming Section */}
            <section className="content-section stream-section">
                <h2 className="neon-text">Streaming</h2>
                <div className="stream-content">
                    <p>Join me on Twitch for FiveM roleplay and various other games! 
                    I love interacting with chat and building a positive community.</p>
                    <a href="https://twitch.tv/EndofTimee" target="_blank" 
                       rel="noopener noreferrer" className="twitch-button">
                        <Twitch className="icon" />
                        Watch Live
                    </a>
                </div>
            </section>

            {/* GitHub Section */}
            <div className="github-section">
                <GithubRepos />
            </div>

            {/* Music Section */}
            <div className="music-section">
                <SpotifyList />
            </div>
        </div>
    );
};

export default App;