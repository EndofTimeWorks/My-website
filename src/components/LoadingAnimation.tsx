import { useEffect, useState } from 'react';
import '@/styles/LoadingAnimation.css';

const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    return Array.from({ length: 100 }, () => characters.charAt(Math.floor(Math.random() * characters.length)));
};

const LoadingAnimation = () => {
    const [codeLines, setCodeLines] = useState<string[]>([]);

    useEffect(() => {
        setCodeLines(generateRandomCode());
    }, []);

    return (
        <div className="loading-container">
            <div className="loading-background">
                {codeLines.map((char, index) => (
                    <span key={index} className="code-char">{char}</span>
                ))}
            </div>
            <div className="loading-blocks">
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
            </div>
        </div>
    );
};

export default LoadingAnimation;
