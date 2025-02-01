import React, { useEffect, useRef } from 'react';
import '../styles/SpotifyVisualizer.css';

const SpotifyVisualizer = ({ isPlaying }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bars = 50;
        const barWidth = canvas.width / bars;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < bars; i++) {
                const height = isPlaying ? 
                    Math.random() * canvas.height * 0.8 : 
                    canvas.height * 0.1;
                
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - height);
                gradient.addColorStop(0, '#9d4edd');
                gradient.addColorStop(1, '#b249f8');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    i * barWidth,
                    canvas.height - height,
                    barWidth - 2,
                    height
                );
            }
            
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying]);

    return (
        <div className="visualizer-container">
            <canvas 
                ref={canvasRef} 
                width={300} 
                height={60} 
                className="music-visualizer"
            />
        </div>
    );
};

export default SpotifyVisualizer;

