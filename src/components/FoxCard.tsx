import type { FoxCardProps } from '@/types';
import '@/styles/FoxCard.css';

const FoxCard = ({ children, className = '' }: FoxCardProps) => (
    <div className={`fox-card ${className}`.trim()}>
        <div className="fox-ear fox-ear-left" />
        <div className="fox-ear fox-ear-right" />
        {children}
    </div>
);

export default FoxCard;
