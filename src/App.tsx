import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AboutPage from '@/pages/AboutPage';
import APCSPPage from '@/pages/APCSPPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/styles/.css';

const App = () => {
    return (
        <ErrorBoundary>
            <Router>
                <div className="app-container animated-bg">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<AboutPage />} />
                            <Route path="/apcsp" element={<APCSPPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="*" element={
                                <div className="error-page">
                                    <h1 className="text-glow">404: Page Not Found</h1>
                                    <p>Oops! This fox couldn't find what you're looking for.</p>
                                </div>
                            } />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ErrorBoundary>
    );
};

export default App;
