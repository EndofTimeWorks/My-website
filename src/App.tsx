import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AboutPage from '@/pages/AboutPage';
import ProjectsPage from '@/pages/ProjectsPage';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-background-primary relative">
                {/* Background Logo */}
                <div className="fixed inset-0 z-behind pointer-events-none">
                    <div className="absolute inset-0 bg-background-primary">
                        <img 
                            src="/logo.jpg" 
                            alt="Background Logo" 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.03] blur-[2px]"
                        />
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="relative z-0">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8 space-y-8">
                        <Routes>
                            <Route path="/" element={<AboutPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="*" element={
                                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                                    <h1 className="text-4xl font-bold text-glow mb-4">404: Page Not Found</h1>
                                    <p className="text-xl text-text-primary/80">This fox couldn't find what you're looking for.</p>
                                </div>
                            } />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

export default App;
