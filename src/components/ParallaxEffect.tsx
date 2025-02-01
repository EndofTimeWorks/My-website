
import React from 'react';
import '@/styles/.css';

const ParallaxEffect = () => {
    return (
        <div className="parallax-container">
            <div className="parallax-layer layer-1"></div>
            <div className="parallax-layer layer-2"></div>
            <div className="content-layer">
                <div className="parallax-text">
                    <h1>Welcome to the Parallax Effect</h1>
                    <p>Scroll down to see the magic happen!</p>
                </div>
            </div>
        </div>
    );
};

export default ParallaxEffect;

