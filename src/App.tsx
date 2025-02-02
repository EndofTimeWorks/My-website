import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AboutPage from "@/pages/AboutPage";
import ProjectsPage from "@/pages/ProjectsPage";

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-background-primary">
                {/* Background Logo */}
                <div className="fixed inset-0 z-behind pointer-events-none">
                    <div className="absolute inset-0">
                        <img 
                            src="/logo.jpg" 
                            alt="Background Logo" 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.03] blur-[2px]"
                        />
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="relative">
                    <Navbar />
                    <main className="content-wrapper section-spacing">
                        <Routes>
                            <Route path="/" element={<AboutPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="*" element={
                                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                                    <h1 className="text-4xl font-bold text-glow">404: Page Not Found</h1>
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
