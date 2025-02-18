// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AboutPage from "@/pages/AboutPage";
import ProjectsPage from "@/pages/ProjectsPage";
import APCSPPage from "@/pages/APCSPPage";
import FoxGame from "@/games/fox-adventure/components/FoxGame";
import { useState, useEffect } from "react";

const App = () => {
    const [isGameActive, setIsGameActive] = useState(false);

    useEffect(() => {
        const konamiCode = [
            'ArrowUp', 'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight',
            'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];
        let index = 0;

        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === konamiCode[index]) {
                index++;
                if (index === konamiCode.length) {
                    setIsGameActive(true);
                }
            } else {
                index = 0;
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    return (
        <Router>
            <div className={`min-h-screen bg-background-primary ${isGameActive ? 'game-active' : ''}`}>
                <div className="fixed inset-0 z-behind pointer-events-none">
                    <div className="absolute inset-0">
                        <img 
                            src="/logo.jpg" 
                            alt="Background Logo" 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.03] blur-[2px]"
                        />
                    </div>
                </div>
                
                <div className="relative">
                    <Navbar />
                    <main className="content-wrapper section-spacing">
                        <Routes>
                            <Route path="/" element={<AboutPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/apcsp" element={<APCSPPage />} />
                            <Route path="*" element={
                                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                                    <h1 className="text-4xl font-bold text-glow">404: Page Not Found</h1>
                                    <p className="text-xl text-text-primary/80">This fox couldn't find what you're looking for.</p>
                                </div>
                            } />
                        </Routes>
                    </main>
                </div>

                {isGameActive && <FoxGame />}
            </div>
        </Router>
    );
};

export default App;