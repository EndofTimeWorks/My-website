import React from 'react';
import '../styles/LoadingFox.css';

const LoadingFox = () => {
    return (
        <div className="loading-fox-container">
            <div className="fox-loader">
                <div className="fox-face">
                    <div className="fox-ears">
                        <div className="ear left"></div>
                        <div className="ear right"></div>
                    </div>
                    <div className="fox-eyes">
                        <div className="eye left"></div>
                        <div className="eye right"></div>
                    </div>
                    <div className="fox-nose"></div>
                </div>
                <div className="loading-text">Loading...</div>
            </div>
        </div>
    );
};

export default LoadingFox;
