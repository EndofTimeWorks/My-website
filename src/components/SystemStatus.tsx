import { useState, useEffect } from 'react';
import { useAuth, systemMembers } from '@/context/AuthContext';
import FoxCard from '@/components/FoxCard';
import { 
  Shield, 
  AlertCircle, 
  Brain, 
  Users, 
  ChevronDown, 
  ChevronUp,
  RefreshCw
} from 'lucide-react';

interface SystemStatusProps {
  minimal?: boolean;
  className?: string;
}

const SystemStatus = ({ minimal = false, className = '' }: SystemStatusProps) => {
  const { systemState, updateSystemState } = useAuth();
  const [expanded, setExpanded] = useState(!minimal);
  const [isUpdating, setIsUpdating] = useState(false);

  // Safety level options with corresponding colors and icons
  const safetyLevels = [
    { value: 'safe', label: 'Safe', color: 'bg-green-500', textColor: 'text-green-500' },
    { value: 'sorta-safe', label: 'Somewhat Safe', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { value: 'unsafe', label: 'Unsafe', color: 'bg-red-500', textColor: 'text-red-500' },
    { value: 'unknown', label: 'Unknown', color: 'bg-gray-500', textColor: 'text-gray-500' }
  ];

  // Mental state options
  const mentalStates = [
    { value: 'ok', label: 'OK', color: 'bg-green-500', textColor: 'text-green-500' },
    { value: 'bad', label: 'Bad', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { value: 'very-bad', label: 'Very Bad', color: 'bg-red-500', textColor: 'text-red-500' },
    { value: 'panic', label: 'Panic', color: 'bg-red-500', textColor: 'text-red-500' },
    { value: 'spiraling', label: 'Spiraling', color: 'bg-purple-500', textColor: 'text-purple-500' },
    { value: 'unstable', label: 'Unstable', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { value: 'delusional', label: 'Delusional', color: 'bg-pink-500', textColor: 'text-pink-500' }
  ];

  // Fronting status options
  const frontingStatuses = [
    { value: 'single', label: 'Single Fronting', color: 'bg-blue-500', textColor: 'text-blue-500' },
    { value: 'co-fronting', label: 'Co-Fronting', color: 'bg-purple-500', textColor: 'text-purple-500' },
    { value: 'switching', label: 'Switching', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { value: 'unknown', label: 'Unknown', color: 'bg-gray-500', textColor: 'text-gray-500' }
  ];

  // Check if the status has been updated in the last 5 minutes
  const [isFresh, setIsFresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Update the "freshness" status every minute
    const updateFreshness = () => {
      if (!lastUpdate) return;
      
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      setIsFresh(lastUpdate > fiveMinutesAgo);
    };
    
    setLastUpdate(new Date());
    const interval = setInterval(updateFreshness, 60000);
    
    return () => clearInterval(interval);
  }, [systemState?.safetyLevel, systemState?.mentalState, systemState?.frontingStatus]);

  // Get colored representation of current states
  const getCurrentSafetyLevel = () => {
    if (!systemState) return safetyLevels[3]; // Unknown
    return safetyLevels.find(level => level.value === systemState.safetyLevel) || safetyLevels[3];
  };

  const getCurrentMentalState = () => {
    if (!systemState) return mentalStates[6]; // Unknown
    return mentalStates.find(state => state.value === systemState.mentalState) || mentalStates[6];
  };

  const getCurrentFrontingStatus = () => {
    if (!systemState) return frontingStatuses[3]; // Unknown
    return frontingStatuses.find(status => status.value === systemState.frontingStatus) || frontingStatuses[3];
  };

  // Handle status change
  const updateStatus = (type: string, value: string) => {
    setIsUpdating(true);
    
    // This would typically involve an API call in a production environment
    setTimeout(() => {
      if (type === 'safety') {
        updateSystemState({ safetyLevel: value as any });
      } else if (type === 'mental') {
        updateSystemState({ mentalState: value as any });
      } else if (type === 'fronting') {
        updateSystemState({ frontingStatus: value as any });
      }
      
      setLastUpdate(new Date());
      setIsFresh(true);
      setIsUpdating(false);
    }, 300);
  };

  // Toggle expansion for mobile/minimal view
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  if (!systemState) return null;

  // For minimal mode, show just a summary with expand option
  if (minimal && !expanded) {
    return (
      <div className={`bg-background-secondary/30 rounded-lg p-3 shadow-sm ${className}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getCurrentSafetyLevel().color}`}></div>
            <span className="text-sm font-medium">System Status</span>
          </div>
          <button 
            onClick={toggleExpand} 
            className="p-1 hover:bg-background-primary/30 rounded-full"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Full or expanded minimal view
  return (
    <FoxCard className={className}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Users className="text-accent-primary" size={20} />
          <h3 className="font-medium">System Status</h3>
        </div>
        {minimal && (
          <button 
            onClick={toggleExpand} 
            className="p-1 hover:bg-background-primary/30 rounded-full"
          >
            <ChevronUp size={16} />
          </button>
        )}
        <div className="flex items-center gap-1">
          <span className="text-xs opacity-70">
            {lastUpdate ? `Updated: ${lastUpdate.toLocaleTimeString()}` : 'Not updated'}
          </span>
          <div className={`ml-1 w-2 h-2 rounded-full ${isFresh ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Safety Level Selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-accent-primary" />
            <span className="text-sm font-medium">Safety Level:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {safetyLevels.map(level => (
              <button
                key={level.value}
                onClick={() => updateStatus('safety', level.value)}
                disabled={isUpdating}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  systemState.safetyLevel === level.value
                    ? `bg-background-secondary border-${level.color} ${level.textColor}`
                    : 'bg-background-primary/30 border-transparent hover:border-gray-600'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mental State Selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-accent-primary" />
            <span className="text-sm font-medium">Mental State:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mentalStates.map(state => (
              <button
                key={state.value}
                onClick={() => updateStatus('mental', state.value)}
                disabled={isUpdating}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  systemState.mentalState === state.value
                    ? `bg-background-secondary border-${state.color} ${state.textColor}`
                    : 'bg-background-primary/30 border-transparent hover:border-gray-600'
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fronting Status Selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-accent-primary" />
            <span className="text-sm font-medium">Fronting Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {frontingStatuses.map(status => (
              <button
                key={status.value}
                onClick={() => updateStatus('fronting', status.value)}
                disabled={isUpdating}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  systemState.frontingStatus === status.value
                    ? `bg-background-secondary border-${status.color} ${status.textColor}`
                    : 'bg-background-primary/30 border-transparent hover:border-gray-600'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Fronters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-accent-primary" />
            <span className="text-sm font-medium">Current Fronters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {systemMembers.slice(0, 3).map(member => (
              <div
                key={member.id}
                className="px-3 py-1 rounded-full text-xs bg-background-primary/40 border border-accent-primary/20"
                style={{ borderColor: member.color }}
              >
                {member.name} ({member.role})
              </div>
            ))}
            <button
              className="px-3 py-1 rounded-full text-xs bg-background-primary/30 border border-transparent hover:border-gray-600 flex items-center gap-1"
            >
              <RefreshCw size={12} />
              <span>Change</span>
            </button>
          </div>
        </div>
      </div>

      {!isFresh && (
        <div className="mt-4 p-2 rounded bg-yellow-500/10 text-yellow-300 text-xs">
          Status was last updated over 5 minutes ago. It may not reflect current conditions.
        </div>
      )}
      
      {isUpdating && (
        <div className="absolute inset-0 bg-background-primary/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="animate-spin w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </FoxCard>
  );
};

export default SystemStatus;
