import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isProtoFoxMode, setIsProtoFoxMode] = useState(() => {
    // Check if user had previously selected protofox mode
    return localStorage.getItem('theme') === 'protofox';
  });

  // Apply theme class to body when toggle changes
  useEffect(() => {
    if (isProtoFoxMode) {
      document.body.classList.add('protofox-theme');
      localStorage.setItem('theme', 'protofox');
    } else {
      document.body.classList.remove('protofox-theme');
      localStorage.setItem('theme', 'default');
    }
  }, [isProtoFoxMode]);

  return (
    <div className={`theme-toggle-container ${className}`}>
      <label className="theme-toggle">
        <input
          type="checkbox"
          checked={isProtoFoxMode}
          onChange={() => setIsProtoFoxMode(!isProtoFoxMode)}
        />
        <div className="toggle-track">
          <div className="toggle-indicator">
            <div className={`fox-ear left ${isProtoFoxMode ? 'active' : ''}`}></div>
            <div className={`fox-ear right ${isProtoFoxMode ? 'active' : ''}`}></div>
            <div className="toggle-visor"></div>
          </div>
        </div>
        <span className="toggle-label">
          {isProtoFoxMode ? 'ProtoFox Mode' : 'Standard Mode'}
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;
