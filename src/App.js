import React, { useEffect } from 'react';
import './styles/rolling-effects.css';  // Fixed import path
import './App.css';

const App = () => {
    useEffect(() => {
        // Generate rolling code lines
        const container = document.querySelector('.rolling-code-container');
        if (container) {
            for (let i = 0; i < 30; i++) {
                const line = document.createElement('div');
                line.className = 'code-line';
                line.style.animationDelay = `${Math.random() * 5}s`;
                line.textContent = Math.random().toString(36).substr(2, 80);
                container.appendChild(line);
            }
        }

        // Generate particles
        const particleContainer = document.querySelector('.particle-container');
        if (particleContainer) {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}vw`;
                particle.style.animationDelay = `${Math.random() * 10}s`;
                particleContainer.appendChild(particle);
            }
        }
    }, []);  

    return (
        <div className="app-container">
            <div className="animated-lighting"></div>
            <div className="rolling-code-container"></div>
            <div className="particle-container"></div>
            <div className="content">
                <h1>Welcome to My Website</h1>
                <p>Enhanced Background with Lighting Effects</p>
            </div>
        </div>
    );
};

export default App;