import React, { useEffect } from 'react';
import './rolling-code.css';
import logo from './logo.png';

const App = () => {
    useEffect(() => {
        // Generate rolling code lines
        const container = document.querySelector('.rolling-code-container');
        for (let i = 0; i < 30; i++) {
            const line = document.createElement('div');
            line.className = 'code-line';
            line.style.animationDelay = `${Math.random() * 5}s`;
            line.textContent = Math.random().toString(36).substr(2, 80);
            container.appendChild(line);
        }

        // Generate particles
        const particleContainer = document.querySelector('.particle-container');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particleContainer.appendChild(particle);
        }
    }, []);  

    return (
        <div>
            <img src={logo} alt="Logo" style="width: 100px; height: auto;"></img>
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
