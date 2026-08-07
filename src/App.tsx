import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import AboutPage from "@/pages/AboutPage";
import ProjectsPage from "@/pages/ProjectsPage";
import FoxGame from "@/games/fox-adventure/components/FoxGame";
import EndOSBootAnimation from "@/components/EndOSBootAnimation";
import "@/styles/animations.css";
import "@/styles/protofox-theme.css";

const BOOT_SESSION_KEY = "endos-boot-complete";

type ActiveRoute = "/" | "/projects" | "not-found";

const getActiveRoute = (pathname: string): ActiveRoute => {
    if (pathname === "/" || pathname === "/projects") {
        return pathname;
    }

    return "not-found";
};

const useEndOSAnimation = () => {
    const [bootComplete, setBootComplete] = useState(
        () => sessionStorage.getItem(BOOT_SESSION_KEY) === "true",
    );

    const urlParams = new URLSearchParams(window.location.search);
    const skipFromUrl = urlParams.get("skipBoot") === "true";

    const handleBootComplete = () => {
        setBootComplete(true);
        sessionStorage.setItem(BOOT_SESSION_KEY, "true");
    };

    return {
        bootComplete,
        handleBootComplete,
        skipBoot: skipFromUrl,
    };
};

const App = () => {
    const [isGameActive, setIsGameActive] = useState(false);
    const [activeRoute, setActiveRoute] = useState<ActiveRoute>(() =>
        getActiveRoute(window.location.pathname),
    );
    const {
        bootComplete,
        handleBootComplete,
        skipBoot,
    } = useEndOSAnimation();
    const shouldShowBoot = !skipBoot && !bootComplete;
    const isAppVisible = bootComplete || skipBoot;

    useEffect(() => {
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
                index += 1;

                if (index === konamiCode.length) {
                    setIsGameActive(true);
                }
            } else {
                index = 0;
            }
        };

        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, []);

    useEffect(() => {
        const handlePopState = () => {
            setActiveRoute(getActiveRoute(window.location.pathname));
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const handleNavigate = (path: "/" | "/projects") => {
        if (window.location.pathname !== path) {
            window.history.pushState(null, "", path);
        }

        setActiveRoute(path);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderRoute = () => {
        switch (activeRoute) {
            case "/":
                return <AboutPage />;
            case "/projects":
                return <ProjectsPage />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                        <h1 className="text-4xl font-bold text-glow">
                            404: Page Not Found
                        </h1>
                        <p className="text-xl text-text-primary/80">
                            This fox couldn't find what you're looking for.
                        </p>
                    </div>
                );
        }
    };

    return (
        <>
            {shouldShowBoot && (
                <EndOSBootAnimation onComplete={handleBootComplete} />
            )}

            <div
                style={{
                    visibility: isAppVisible ? "visible" : "hidden",
                    opacity: isAppVisible ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                }}
            >
                <ErrorBoundary>
                    <div
                        className={`min-h-screen bg-background-primary ${isGameActive ? "game-active" : ""}`}
                    >
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
                            <Navbar
                                activePath={
                                    activeRoute === "not-found"
                                        ? window.location.pathname
                                        : activeRoute
                                }
                                onNavigate={handleNavigate}
                            />

                            <main className="content-wrapper section-spacing pb-20 animate-fade-in">
                                {renderRoute()}
                            </main>

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
                </ErrorBoundary>
            </div>
        </>
    );
};

export default App;
