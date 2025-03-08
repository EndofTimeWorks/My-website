// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import AboutPage from "@/pages/AboutPage";
import ProjectsPage from "@/pages/ProjectsPage";
import APCSPPage from "@/pages/APCSPPage";
import LoginPage from "@/pages/LoginPage";
import SystemPage from "@/pages/SystemPage";
import VNCViewer from "@/components/VNCViewer";
import SystemStatus from "@/components/SystemStatus";
import SwitchNotification from "@/components/SwitchNotification";
import ProtectedRoute from "@/components/ProtectedRoute";
import FoxGame from "@/games/fox-adventure/components/FoxGame";
import { useState, useEffect } from "react";
import '@/styles/animations.css';

// AuthChecker component to access auth context inside the router
const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [isStatusVisible, setIsStatusVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'switch' | 'warning' | 'notice'>('switch');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedAlter, setSelectedAlter] = useState('');

  // Toggle system status floating panel
  const toggleStatus = () => {
    setIsStatusVisible(prev => !prev);
  };

  // Simulate random switches for demo purposes
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    // Every 5-15 minutes, show a switch notification
    const randomInterval = Math.floor(Math.random() * (15 - 5 + 1) + 5) * 60 * 1000;
    const interval = setInterval(() => {
      // 70% chance of switch, 20% chance of notice, 10% chance of warning
      const rand = Math.random();
      
      if (rand < 0.7) {
        setNotificationType('switch');
        setSelectedAlter(''); // Random alter will be selected
      } else if (rand < 0.9) {
        setNotificationType('notice');
        setNotificationMessage('System communication active');
      } else {
        setNotificationType('warning');
        setNotificationMessage('System experiencing stress');
      }
      
      setShowNotification(true);
    }, randomInterval);

    return () => clearInterval(interval);
  }, [auth.isAuthenticated]);

  return (
    <>
      {children}
      
      {/* Floating System Status for authenticated users */}
      {auth.isAuthenticated && (
        <>
          <div 
            className={`fixed bottom-4 right-4 z-40 transition-transform duration-300 ${
              isStatusVisible ? 'translate-y-0' : 'translate-y-[calc(100%-40px)]'
            }`}
          >
            <div 
              className="p-2 bg-background-secondary rounded-t-lg cursor-pointer flex justify-center items-center"
              onClick={toggleStatus}
            >
              <span className="text-xs font-medium">
                {isStatusVisible ? "Hide System Status" : "System Status"}
              </span>
            </div>
            <SystemStatus 
              minimal={true} 
              className="shadow-lg rounded-t-none w-[300px] max-w-[calc(100vw-2rem)]" 
            />
          </div>

          {/* System Notifications */}
          <SwitchNotification 
            show={showNotification}
            onClose={() => setShowNotification(false)}
            alterName={selectedAlter}
            type={notificationType}
            message={notificationMessage}
            autoClose
            autoCloseDelay={5000}
          />
        </>
      )}
    </>
  );
};

const App = () => {
    const [isGameActive, setIsGameActive] = useState(false);
    const [showInitialSwitchDemo, setShowInitialSwitchDemo] = useState(false);

    // Demo the switch notification after a delay
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowInitialSwitchDemo(true);
        
        // Hide after 5 seconds
        setTimeout(() => {
          setShowInitialSwitchDemo(false);
        }, 5000);
      }, 10000);
      
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Konami code sequence
        const konamiCode = [
            'ArrowUp', 'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight',
            'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];
        let index = 0;

        const handleKeydown = (event: KeyboardEvent) => {
            // Check if the pressed key matches the next key in the sequence
            if (event.key === konamiCode[index]) {
                index++;
                
                // If the entire sequence is completed
                if (index === konamiCode.length) {
                    setIsGameActive(true);
                    // Optional: Play a sound or show a notification
                    console.log('Konami code activated!');
                }
            } else {
                // Reset if a wrong key is pressed
                index = 0;
            }
        };

        window.addEventListener('keydown', handleKeydown);
        
        // Clean up the event listener on component unmount
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    return (
        <AuthProvider>
            <Router>
                <AuthChecker>
                    <div className={`min-h-screen bg-background-primary ${isGameActive ? 'game-active' : ''}`}>
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
                            <main className="content-wrapper section-spacing pb-20 animate-fade-in">
                                <Routes>
                                    <Route path="/" element={<AboutPage />} />
                                    <Route path="/projects" element={<ProjectsPage />} />
                                    <Route path="/apcsp" element={<APCSPPage />} />
                                    <Route path="/vnc" element={<VNCViewer />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route 
                                        path="/system" 
                                        element={
                                            <ProtectedRoute>
                                                <SystemPage />
                                            </ProtectedRoute>
                                        } 
                                    />
                                    <Route path="*" element={
                                        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                                            <h1 className="text-4xl font-bold text-glow">404: Page Not Found</h1>
                                            <p className="text-xl text-text-primary/80">This fox couldn't find what you're looking for.</p>
                                        </div>
                                    } />
                                </Routes>
                            </main>
                            
                            {/* Footer */}
                            <footer className="py-6 border-t border-accent-primary/10 text-center text-sm text-text-primary/60">
                                <p>© 2023 - {new Date().getFullYear()} EndofTimee. All rights reserved.</p>
                                <div className="flex justify-center items-center gap-2 mt-2">
                                    <span className="text-xs">Try the Konami code: ↑↑↓↓←→←→BA</span>
                                    <div className="bg-background-secondary px-2 py-0.5 rounded-full text-[10px] text-accent-primary">
                                        v1.3.0
                                    </div>
                                </div>
                            </footer>
                        </div>

                        {/* Demo Switch Notification */}
                        <SwitchNotification 
                          show={showInitialSwitchDemo}
                          onClose={() => setShowInitialSwitchDemo(false)}
                          alterName="Aurora"
                          type="switch"
                          autoClose
                          autoCloseDelay={5000}
                        />

                        {/* Fox Game Overlay - Activated by Konami Code */}
                        {isGameActive && (
                            <>
                                <FoxGame />
                                <button 
                                    onClick={() => setIsGameActive(false)}
                                    className="fixed top-4 right-4 z-[999] bg-red-500/80 hover:bg-red-500 px-3 py-1.5 rounded-md text-white text-sm font-medium transition-colors"
                                >
                                    Exit Game
                                </button>
                            </>
                        )}
                    </div>
                </AuthChecker>
            </Router>
        </AuthProvider>
    );
};

export default App;
