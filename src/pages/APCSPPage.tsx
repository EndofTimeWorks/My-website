import React from 'react';
import FoxCard from '../components/FoxCard';
import { Code, BookOpen, Cpu } from 'lucide-react';

const APCSPPage = () => {
    return (
        <div className="page-container">
            <FoxCard className="header-card">
                <h1 className="text-glow">AP Computer Science Principles</h1>
                <p className="text-gradient">Exploring the foundations of modern computing</p>
            </FoxCard>

            <div className="content-grid">
                <FoxCard>
                    <div className="flex items-center gap-4">
                        <Code size={24} className="text-accent-primary" />
                        <h2>Programming Concepts</h2>
                    </div>
                    <p>Learn the creative aspects of programming, abstractions, and algorithms</p>
                </FoxCard>

                <FoxCard>
                    <div className="flex items-center gap-4">
                        <Cpu size={24} className="text-accent-primary" />
                        <h2>Project Demo</h2>
                    </div>
                    <div className="project-demo">
                        <iframe 
                            src="https://drive.google.com/file/d/1JT7nZ82QJh5NIxFVHyewRBR1MLsWohEF/preview" 
                            width="100%"
                            height="400"
                            className="rounded-lg"
                            allowFullScreen
                        />
                    </div>
                </FoxCard>
            </div>
        </div>
    );
};

export default APCSPPage;

