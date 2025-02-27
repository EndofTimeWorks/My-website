import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, X } from 'lucide-react';
import { systemMembers } from '@/context/AuthContext';

interface SwitchNotificationProps {
  show: boolean;
  onClose: () => void;
  alterName?: string;
  type?: 'switch' | 'warning' | 'notice';
  message?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const SwitchNotification = ({
  show,
  onClose,
  alterName,
  type = 'switch',
  message,
  autoClose = true,
  autoCloseDelay = 5000
}: SwitchNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

  // Random alter selection if none provided
  const [selectedAlter, setSelectedAlter] = useState(alterName);

  useEffect(() => {
    if (!alterName && show) {
      // Select a random alter if none provided
      const randomIndex = Math.floor(Math.random() * systemMembers.length);
      setSelectedAlter(systemMembers[randomIndex].name);
    } else if (alterName) {
      setSelectedAlter(alterName);
    }
  }, [alterName, show]);

  // Handle visibility state
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setProgress(100);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  // Auto-close countdown
  useEffect(() => {
    if (autoClose && isVisible) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (autoCloseDelay / 100));
          if (newProgress <= 0) {
            clearInterval(interval);
            handleClose();
            return 0;
          }
          return newProgress;
        });
      }, 100);
      
      setProgressInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [autoClose, isVisible, autoCloseDelay]);

  // Handle close action
  const handleClose = () => {
    setIsVisible(false);
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Don't render if not visible
  if (!show && !isVisible) return null;

  // Get the right icon and styles based on notification type
  const getIconAndStyles = () => {
    switch (type) {
      case 'warning':
        return {
          icon: <AlertCircle className="text-yellow-400" size={20} />,
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-300'
        };
      case 'notice':
        return {
          icon: <AlertCircle className="text-blue-400" size={20} />,
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-300'
        };
      case 'switch':
      default:
        return {
          icon: <RefreshCw className="text-accent-primary animate-spin" size={20} />,
          bgColor: 'bg-accent-primary/20',
          borderColor: 'border-accent-primary/30',
          textColor: 'text-accent-primary'
        };
    }
  };

  const { icon, bgColor, borderColor, textColor } = getIconAndStyles();

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 max-w-xs w-full sm:w-auto transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className={`relative p-4 rounded-lg shadow-lg ${bgColor} border ${borderColor}`}>
        {/* Title row with icon, text and close button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <span className={`font-medium ${textColor}`}>
              {type === 'switch' ? 'System Switch Detected' : type === 'warning' ? 'System Warning' : 'System Notice'}
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-background-primary/30 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Message content */}
        <div className="text-sm text-text-primary/90">
          {type === 'switch' ? (
            <>Now fronting: <span className="font-medium">{selectedAlter}</span></>
          ) : (
            message || 'System notification'
          )}
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="w-full h-1 bg-background-primary/30 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-100 ${
                type === 'switch' ? 'bg-accent-primary' : 
                type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SwitchNotification;
