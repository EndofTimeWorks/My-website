import { useCallback, useEffect, useState } from "react";
import "@/styles/EndOSBootAnimation.css";

interface EndOSBootAnimationProps {
    onComplete?: () => void;
    skipAnimation?: boolean;
}

const bootSequence = [
    { stage: 2, duration: 2600 },
    { stage: 3, duration: 3000 },
    { stage: 4, duration: 3000 },
    { stage: 5, duration: 3200 },
    { stage: 6, duration: 2600 },
    { stage: 7, duration: 2200 },
];

const EndOSBootAnimation = ({
    onComplete,
    skipAnimation = false,
}: EndOSBootAnimationProps) => {
    const [active, setActive] = useState(true);
    const [bootStage, setBootStage] = useState(0);

    const handleAnimationComplete = useCallback(() => {
        setActive(false);
        onComplete?.();
    }, [onComplete]);

    useEffect(() => {
        if (skipAnimation) {
            const timer = setTimeout(handleAnimationComplete, 0);
            return () => clearTimeout(timer);
        }

        const timers: ReturnType<typeof setTimeout>[] = [];

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            timers.push(setTimeout(() => setBootStage(7), 0));
            timers.push(setTimeout(handleAnimationComplete, 900));
            return () => timers.forEach(clearTimeout);
        }

        let elapsed = 350;

        bootSequence.forEach(({ stage, duration }) => {
            timers.push(setTimeout(() => setBootStage(stage), elapsed));
            elapsed += duration;
        });
        timers.push(setTimeout(handleAnimationComplete, elapsed));

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [skipAnimation, handleAnimationComplete]);

    const handleSkip = () => {
        handleAnimationComplete();
    };

    if (!active) return null;

    return (
        <div className="endos-boot-container">
            {/* Accessibility */}
            <div className="visually-hidden">
                Website loading. EndOS boot sequence in progress.
            </div>

            <div className="boot-scan-line"></div>

            <div className="boot-visor-frame">
                <div className="visor-left-ear"></div>
                <div className="visor-right-ear"></div>

                <div className="boot-visor">
                    <div className="visor-line top"></div>
                    <div className="visor-line bottom"></div>

                    {/* Boot Sequence Content */}
                    <div className="boot-content active">
                        {/* BIOS Check */}
                        <div
                            className={`boot-stage bios ${bootStage === 2 ? "active" : ""}`}
                        >
                            <div className="bios-header">END_OS BIOS v2.5</div>
                            <div className="boot-text-line">
                                Initializing hardware...
                            </div>
                            <div className="boot-text-line">
                                CPU: ProtoCore i9 @ 4.7GHz
                            </div>
                            <div className="boot-text-line">
                                Memory: 16GB NeuralRAM
                            </div>
                            <div className="boot-text-line">
                                Checking system integrity... OK
                            </div>
                            <div className="boot-text-line">
                                Starting boot sequence...
                            </div>
                        </div>

                        {/* System Scan */}
                        <div
                            className={`boot-stage scan ${bootStage === 3 ? "active" : ""}`}
                        >
                            <div className="scan-header">SYSTEM SCAN</div>
                            <div className="scan-progress-container">
                                <div className="scan-progress-bar"></div>
                            </div>
                            <div className="scan-detail">
                                Checking vital systems...
                            </div>
                            <div className="scan-detail">
                                Initializing neural pathways...
                            </div>
                            <div className="scan-detail">
                                Activating sensory modules...
                            </div>
                            <div className="scan-detail">
                                All systems nominal
                            </div>
                        </div>

                        {/* Module Loading */}
                        <div
                            className={`boot-stage modules ${bootStage === 4 ? "active" : ""}`}
                        >
                            <div className="module-header">
                                LOADING CORE MODULES
                            </div>
                            <div className="modules-grid">
                                <div className="module-item">
                                    <div className="module-icon"></div>
                                    <div className="module-name">
                                        ProtogenCore
                                    </div>
                                </div>
                                <div className="module-item">
                                    <div className="module-icon"></div>
                                    <div className="module-name">NeuralNet</div>
                                </div>
                                <div className="module-item">
                                    <div className="module-icon"></div>
                                    <div className="module-name">
                                        VisorDisplay
                                    </div>
                                </div>
                                <div className="module-item">
                                    <div className="module-icon"></div>
                                    <div className="module-name">FoxTraits</div>
                                </div>
                            </div>
                        </div>

                        {/* Fox Protocol */}
                        <div
                            className={`boot-stage fox-protocol ${bootStage === 5 ? "active" : ""}`}
                        >
                            <div className="fox-header">
                                ACTIVATING FOX PROTOCOLS
                            </div>
                            <div className="fox-trait">
                                Fluffy tail module: Online
                            </div>
                            <div className="fox-trait">
                                Fox ears: Calibrated
                            </div>
                            <div className="fox-trait">
                                Cuteness factor: Nonexistent
                            </div>
                            <div className="fox-trait">
                                Mischief subroutines: Loaded
                            </div>
                            <div className="fox-trait">
                                ProtoFox integration: Complete
                            </div>
                        </div>

                        {/* Logo Display */}
                        <div
                            className={`boot-stage logo-display ${bootStage === 6 ? "active" : ""}`}
                        >
                            <div className="endos-logo">
                                <span className="logo-end">End</span>
                                <span className="logo-os">OS</span>
                            </div>
                            <div className="logo-subtitle">
                                ProtoFox Operating System
                            </div>
                        </div>

                        {/* System Ready */}
                        <div
                            className={`boot-stage system-ready ${bootStage === 7 ? "active" : ""}`}
                        >
                            <div className="ready-status">SYSTEM ACTIVATED</div>
                            <div className="welcome-message">
                                Welcome back, ProtoFox
                            </div>
                            <div className="boot-complete-message">
                                EndOS v1.0 is fully operational
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skip button - More prominent and always visible */}
            <button
                className="skip-button"
                onClick={handleSkip}
                aria-label="Skip boot animation"
            >
                SKIP BOOT SEQUENCE
            </button>
        </div>
    );
};

export default EndOSBootAnimation;
