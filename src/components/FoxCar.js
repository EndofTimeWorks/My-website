import React from 'react';
import '../styles/FoxCard.css';

const FoxCard = ({ children, className = '' }) => {
    return (
        <div className={`fox-card ${className}`}>
            <div className="fox-ear fox-ear-left" />
            <div className="fox-ear fox-ear-right" />
            {children}
        </div>
    );
};

export default FoxCard;