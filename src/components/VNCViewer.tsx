import { useState, useEffect } from 'react';
import { Monitor, Power, Lock, Maximize, Minimize, RefreshCw } from 'lucide-react';
import FoxCard from '@/components/FoxCard';

// Ideally, this should come from environment variables
const VNC_HOST = import.meta.env.VITE_VNC_HOST || '68.104.222.58';
const VNC_PORT = import.meta.env.VITE_VNC_PORT || '6080';
const VNC_WS_PORT = import.meta.env.VITE_VNC_WS_PORT || '5901';

const VNCViewer = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const toggleFullscreen = () => {
    const iframe = document.getElementById('vnc-iframe');
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen().catch(err => {
          setError(`Fullscreen error: ${err.message}`);
        });
      } else {
        document.exitFullscreen().catch(err => {
          setError(`Exit fullscreen error: ${err.message}`);
        });
      }
    }
  };

  const handleConnect = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate connection process
    setTimeout(() => {
      try {
        setIsConnected(true);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to connect to VNC server');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const refreshConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      setTimeout(() => setIsConnected(true), 500);
    }
  };

  const connectionUrl = `http://${VNC_HOST}:${VNC_PORT}/vnc.html?host=${VNC_HOST}&port=${VNC_WS_PORT}&autoconnect=true&resize=scale`;

  return (
    <div className="page-container">
      <FoxCard className="header-card">
        <h1 className="text-glow">Remote Access</h1>
        <p className="text-gradient">Raspberry Pi VNC Connection</p>
      </FoxCard>
      
      <FoxCard className="w-full max-w-6xl mx-auto overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-accent-primary/20">
          <div className="flex items-center gap-3">
            <Monitor className="text-accent-primary" size={24} />
            <h2 className="text-xl font-semibold text-text-primary">Raspberry Pi Remote Access</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {isConnected && (
              <>
                <button 
                  onClick={refreshConnection}
                  className="p-2 rounded-lg hover:bg-accent-primary/20 transition-colors"
                  title="Refresh Connection"
                >
                  <RefreshCw size={20} className="text-accent-primary" />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg hover:bg-accent-primary/20 transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize size={20} className="text-accent-primary" />
                  ) : (
                    <Maximize size={20} className="text-accent-primary" />
                  )}
                </button>
              </>
            )}
            <button 
              onClick={isConnected ? handleDisconnect : handleConnect}
              className={`p-2 rounded-lg transition-colors ${
                isConnected 
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-400" 
                  : "hover:bg-accent-primary/20 text-accent-primary"
              }`}
              title={isConnected ? "Disconnect" : "Connect"}
              disabled={isLoading}
            >
              <Power 
                size={20} 
                className={isConnected ? "text-red-400" : "text-accent-primary"} 
              />
            </button>
          </div>
        </div>
        
        <div className="aspect-video w-full bg-black/50 relative">
          {isConnected ? (
            <iframe
              id="vnc-iframe"
              src={connectionUrl}
              className="w-full h-full border-0"
              allow="fullscreen"
            />
          ) : isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-primary/60">
              <div className="w-12 h-12 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin mb-4" />
              <p>Connecting to VNC server...</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-primary/60">
              <Lock size={48} className="mb-4 text-accent-primary/40" />
              <p>Click the power button to connect</p>
            </div>
          )}
          
          {error && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500/80 text-white p-2 text-center text-sm">
              {error}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-accent-primary/20 flex flex-col sm:flex-row sm:justify-between items-center gap-2 text-sm text-text-primary/60">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
            <span>Server: {VNC_HOST}</span>
            <span>Press ESC to exit fullscreen</span>
          </div>
        </div>
      </FoxCard>
      
      <div className="mt-6 max-w-6xl mx-auto">
        <FoxCard>
          <h3 className="text-lg font-semibold mb-2">Connection Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click the power button in the top right to connect</li>
            <li>Once connected, you can interact with the remote desktop</li>
            <li>Use the maximize button to enter fullscreen mode</li>
            <li>If the connection is unresponsive, try clicking the refresh button</li>
          </ol>
          
          <div className="mt-4 p-3 bg-background-secondary/30 rounded-lg text-sm">
            <p className="text-yellow-300">Note: This VNC connection is not encrypted. Do not transmit sensitive information when using this interface.</p>
          </div>
        </FoxCard>
      </div>
    </div>
  );
};

export default VNCViewer;
