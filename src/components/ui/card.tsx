import { type CardProps } from '@/types';

export const Card: React.FC<CardProps> = ({ className, children }) => (
    <div className={`card ${className || ''}`}>{children}</div>
);

export const CardHeader: React.FC<CardProps> = ({ className, children }) => (
    <div className={`card-header ${className || ''}`}>{children}</div>
);

export const CardTitle: React.FC<CardProps> = ({ className, children }) => (
    <h2 className={`card-title ${className || ''}`}>{children}</h2>
);

export const CardContent: React.FC<CardProps> = ({ className, children }) => (
    <div className={`card-content ${className || ''}`}>{children}</div>
);
