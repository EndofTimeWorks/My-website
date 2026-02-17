import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import AboutPage from "@/pages/AboutPage";
import ProjectsPage from "@/pages/ProjectsPage";
import FoxGame from "@/games/fox-adventure/components/FoxGame";
import ThemeToggle from "@/components/ThemeToggle";
import EndOSBootAnimation from "@/components/EndOSBootAnimation";
import "@/styles/animations.css";
import "@/styles/protofox-theme.css";

// EndOS animation control
const useEndOSAnimation = () => {
    const [bootComplete, setBootComplete] = useState(false);
    const [skipBoot] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const skipParam = urlParams.get("skipBoot");
        const sessionSeen =
            sessionStorage.getItem("endos-boot-complete") === "true";

        return skipParam === "true" || sessionSeen;
    });

    const handleBootComplete = () => {
        setBootComplete(true);
        sessionStorage.setItem("endos-boot-complete", "true");
    };

    return { bootComplete, skipBoot, handleBootComplete };
};

// AuthChecker component to access auth context inside the router
const AuthChecker = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth();
    const [isStatusVisible, setIsStatusVisible] = useState(false);

    const toggleStatus = () => {
        setIsStatusVisible((prev) => !prev);
    };

    return (
        <>
            {children}

            {auth.isAuthenticated && (
                <div
                    className={`fixed bottom-4 right-4 z-40 transition-transform duration-300 ${
                        isStatusVisible
                            ? "translate-y-0"
                            : "translate-y-[calc(100%-40px)]"
                    }`}
                >
                    <div
                        className="p-2 bg-background-secondary rounded-t-lg cursor-pointer flex justify-center items-center"
                        onClick={toggleStatus}
                    >
                        <span className="text-xs font-medium">
                            {isStatusVisible
                                ? "Hide System Status"
                                : "System Status"}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

const App = () => {
    const [isGameActive, setIsGameActive] = useState(false);
    const { bootComplete, skipBoot, handleBootComplete } = useEndOSAnimation();

    useEffect(() => {
        // Konami code sequence
        const konamiCode = [
            "ArrowUp",
            "ArrowUp",
            "ArrowDown",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "ArrowLeft",
            "ArrowRight",
            "b",
            "a",
        ];
        let index = 0;

        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === konamiCode[index]) {
                index++;

                if (index === konamiCode.length) {
                    setIsGameActive(true);
                    console.log("Konami code activated!");
                }
            } else {
                index = 0;
            }
        };

        window.addEventListener("keydown", handleKeydown);

        return () => window.removeEventListener("keydown", handleKeydown);
    }, []);

    return (
        <AuthProvider>
            {/* EndOS Boot Animation */}
            {!skipBoot && !bootComplete && (
                <EndOSBootAnimation onComplete={handleBootComplete} />
            )}

            {/* Main Application - Only visible after boot animation completes */}
            <div
                style={{
                    visibility: bootComplete || skipBoot ? "visible" : "hidden",
                    opacity: bootComplete || skipBoot ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                }}
            >
                <Router>
                    <AuthChecker>
                        <div
                            className={`min-h-screen bg-background-primary ${isGameActive ? "game-active" : ""}`}
                        >
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

                                {/* Theme Toggle */}
                                <div className="fixed top-20 right-4 z-30">
                                    <ThemeToggle />
                                </div>

                                <main className="content-wrapper section-spacing pb-20 animate-fade-in">
                                    <Routes>
                                        <Route
                                            path="/"
                                            element={<AboutPage />}
                                        />
                                        <Route
                                            path="/projects"
                                            element={<ProjectsPage />}
                                        />
                                        <Route
                                            path="*"
                                            element={
                                                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                                                    <h1 className="text-4xl font-bold text-glow">
                                                        404: Page Not Found
                                                    </h1>
                                                    <p className="text-xl text-text-primary/80">
                                                        This fox couldn't find
                                                        what you're looking for.
                                                    </p>
                                                </div>
                                            }
                                        />
                                    </Routes>
                                </main>

                                {/* Footer */}
                                <footer className="py-6 border-t border-accent-primary/10 text-center text-sm text-text-primary/60">
                                    <p>
                                        © 2023 - {new Date().getFullYear()}{" "}
                                        EndofTimee. All rights reserved.
                                    </p>
                                    <div className="flex justify-center items-center gap-2 mt-2">
                                        <span className="text-xs">
                                            Try the Konami code: ↑↑↓↓←→←→BA
                                        </span>
                                        <div className="bg-background-secondary px-2 py-0.5 rounded-full text-[10px] text-accent-primary">
                                            v0.9.5
                                        </div>
                                    </div>
                                </footer>
                            </div>

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
            </div>
        </AuthProvider>
    );
};

export default App;
