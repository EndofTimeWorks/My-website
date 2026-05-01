import { useCallback, useEffect, useState } from "react";
import "@/styles/EndOSBootAnimation.css";

interface EndOSBootAnimationProps {
    onComplete?: () => void;
    skipAnimation?: boolean;
}

const bootSequence = [
    { stage: 1, delay: 1500 },
    { stage: 2, delay: 3000 },
    { stage: 3, delay: 3500 },
    { stage: 4, delay: 3500 },
    { stage: 5, delay: 3500 },
    { stage: 6, delay: 3000 },
    { stage: 7, delay: 3000 },
    { stage: 8, delay: 2000 },
];

const EndOSBootAnimation = ({
    onComplete,
    skipAnimation = false,
}: EndOSBootAnimationProps) => {
    const [active, setActive] = useState(!skipAnimation);
    const [bootStage, setBootStage] = useState(0);

    const handleAnimationComplete = useCallback(() => {
        setActive(false);
        onComplete?.();
    }, [onComplete]);

    useEffect(() => {
        if (skipAnimation) {
            onComplete?.();
            return;
        }

        const timeouts: Array<ReturnType<typeof setTimeout>> = [];

        const queueTimeout = (
            callback: () => void,
            delay: number,
        ): ReturnType<typeof setTimeout> => {
            const timeout = setTimeout(callback, delay);
            timeouts.push(timeout);
            return timeout;
        };

        const runStage = (index: number) => {
            if (index >= bootSequence.length) {
                handleAnimationComplete();
                return;
            }

            const { stage, delay } = bootSequence[index];
            setBootStage(stage);
            queueTimeout(() => runStage(index + 1), delay);
        };

        queueTimeout(() => runStage(0), 500);

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, [skipAnimation, handleAnimationComplete, onComplete]);

    if (!active) {
        return null;
    }

    return (
        <div className="endos-boot-container">
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

                    <div className={`boot-content ${bootStage > 0 ? "active" : ""}`}>
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
                            <div className="scan-detail">All systems nominal</div>
                        </div>

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

                        <div
                            className={`boot-stage fox-protocol ${bootStage === 5 ? "active" : ""}`}
                        >
                            <div className="fox-header">
                                ACTIVATING FOX PROTOCOLS
                            </div>
                            <div className="fox-trait">
                                Fluffy tail module: Online
                            </div>
                            <div className="fox-trait">Fox ears: Calibrated</div>
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

            <button
                className="skip-button"
                onClick={handleAnimationComplete}
                aria-label="Skip boot animation"
            >
                SKIP BOOT SEQUENCE
            </button>
        </div>
    );
};

export default EndOSBootAnimation;
