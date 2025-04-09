import React, { useState, useEffect } from 'react';
import '@/styles/EndOSBootAnimation.css';

interface EndOSBootAnimationProps {
  // Using underscores to mark unused props to avoid TypeScript errors
  _customLogo?: string;
  _customColors?: {
    primary?: string;
    secondary?: string;
    fox?: string;
  };
  onComplete?: () => void;
  skipAnimation?: boolean;
}

const EndOSBootAnimation: React.FC<EndOSBootAnimationProps> = ({ 
  onComplete, 
  skipAnimation = false,
  // Rename with underscores to indicate variables are intentionally unused
  _customLogo,
  _customColors
}) => {
  const [active, setActive] = useState(true);
  const [bootStage, setBootStage] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  // Boot sequence timing
  useEffect(() => {
    if (skipAnimation) {
      handleAnimationComplete();
      return;
    }
    
    // Initialize boot sequence with proper timing to prevent overlap
    const bootSequence = [
      { stage: 1, delay: 1500 },   // Initial screen flicker
      { stage: 2, delay: 3000 },  // BIOS check (longer time to read)
      { stage: 3, delay: 3500 },  // System scan (longer for progress bar)
      { stage: 4, delay: 3500 },  // Loading modules (allow time for animation)
      { stage: 5, delay: 3500 },  // Fox protocols (allow time to read traits)
      { stage: 6, delay: 3000 },  // Show logo (allow time to appreciate)
      { stage: 7, delay: 3000 },  // Final activation (longer read time)
      { stage: 8, delay: 2000 }   // Fade out
    ];
    
    let timeout: any; // Using any instead of NodeJS.Timeout
    let currentIndex = 0;
    
    const runNextStage = () => {
      if (currentIndex < bootSequence.length) {
        const { stage, delay } = bootSequence[currentIndex];
        
        // Clean transition - clear ALL previous stages to prevent any background visibility
        document.querySelectorAll('.boot-stage').forEach(el => {
          el.classList.remove('active');
        });
        
        // Reset content visibility
        document.querySelectorAll('.boot-content').forEach(el => {
          el.classList.remove('active');
        });
        
        // Short delay to allow for transition
        setTimeout(() => {
          // First ensure boot content is visible
          document.querySelectorAll('.boot-content').forEach(el => {
            el.classList.add('active');
          });
          
          // Then activate the correct stage
          setBootStage(stage);
          
          if (stage === 6) {
            setShowLogo(true);
          } else if (stage === 7) {
            setBootComplete(true);
          }
        }, 300);
        
        currentIndex++;
        timeout = setTimeout(runNextStage, delay);
      } else {
        handleAnimationComplete();
      }
    };
    
    // Start the sequence
    timeout = setTimeout(runNextStage, 500);
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [skipAnimation]);
  
  const handleAnimationComplete = () => {
    setActive(false);
    if (onComplete) {
      onComplete();
    }
  };
  
  // Skip button click handler
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
          <div className={`boot-content`}>
            {/* BIOS Check */}
            <div className={`boot-stage bios ${bootStage === 2 ? 'active' : ''}`}>
              <div className="bios-header">END_OS BIOS v2.5</div>
              <div className="boot-text-line">Initializing hardware...</div>
              <div className="boot-text-line">CPU: ProtoCore i9 @ 4.7GHz</div>
              <div className="boot-text-line">Memory: 16GB NeuralRAM</div>
              <div className="boot-text-line">Checking system integrity... OK</div>
              <div className="boot-text-line">Starting boot sequence...</div>
            </div>
            
            {/* System Scan */}
            <div className={`boot-stage scan ${bootStage === 3 ? 'active' : ''}`}>
              <div className="scan-header">SYSTEM SCAN</div>
              <div className="scan-progress-container">
                <div className="scan-progress-bar"></div>
              </div>
              <div className="scan-detail">Checking vital systems...</div>
              <div className="scan-detail">Initializing neural pathways...</div>
              <div className="scan-detail">Activating sensory modules...</div>
              <div className="scan-detail">All systems nominal</div>
            </div>
            
            {/* Module Loading */}
            <div className={`boot-stage modules ${bootStage === 4 ? 'active' : ''}`}>
              <div className="module-header">LOADING CORE MODULES</div>
              <div className="modules-grid">
                <div className="module-item">
                  <div className="module-icon"></div>
                  <div className="module-name">ProtogenCore</div>
                </div>
                <div className="module-item">
                  <div className="module-icon"></div>
                  <div className="module-name">NeuralNet</div>
                </div>
                <div className="module-item">
                  <div className="module-icon"></div>
                  <div className="module-name">VisorDisplay</div>
                </div>
                <div className="module-item">
                  <div className="module-icon"></div>
                  <div className="module-name">FoxTraits</div>
                </div>
              </div>
            </div>
            
            {/* Fox Protocol */}
            <div className={`boot-stage fox-protocol ${bootStage === 5 ? 'active' : ''}`}>
              <div className="fox-header">ACTIVATING FOX PROTOCOLS</div>
              <div className="fox-trait">Fluffy tail module: Online</div>
              <div className="fox-trait">Fox ears: Calibrated</div>
              <div className="fox-trait">Cuteness factor: Nonexistent</div>
              <div className="fox-trait">Mischief subroutines: Loaded</div>
              <div className="fox-trait">ProtoFox integration: Complete</div>
            </div>
            
            {/* Logo Display */}
            <div className={`boot-stage logo-display ${bootStage === 6 && showLogo ? 'active' : ''}`}>
              <div className="endos-logo">
                <span className="logo-end">End</span>
                <span className="logo-os">OS</span>
              </div>
              <div className="logo-subtitle">ProtoFox Operating System</div>
            </div>
            
            {/* System Ready */}
            <div className={`boot-stage system-ready ${bootStage === 7 && bootComplete ? 'active' : ''}`}>
              <div className="ready-status">SYSTEM ACTIVATED</div>
              <div className="welcome-message">Welcome back, ProtoFox</div>
              <div className="boot-complete-message">EndOS v1.0 is fully operational</div>
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