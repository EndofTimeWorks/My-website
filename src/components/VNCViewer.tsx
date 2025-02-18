import { useState } from 'react';
import { Monitor, Power, Lock } from 'lucide-react';

const VNCViewer = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  const toggleFullscreen = () => {
    const iframe = document.getElementById('vnc-iframe');
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-background-primary/80 backdrop-blur-sm rounded-xl shadow-xl border border-accent-primary/20 overflow-hidden transition-all duration-300 hover:border-accent-neon/40 hover:shadow-accent-primary/20">
        <div className="flex items-center justify-between p-4 border-b border-accent-primary/20">
          <div className="flex items-center gap-3">
            <Monitor className="text-accent-primary" size={24} />
            <h2 className="text-xl font-semibold text-text-primary">Raspberry Pi Remote Access</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-accent-primary/20 transition-colors"
              title="Toggle Fullscreen"
            >
              <Monitor size={20} className="text-accent-primary" />
            </button>
            <button 
              onClick={() => setIsConnected(!isConnected)}
              className="p-2 rounded-lg hover:bg-accent-primary/20 transition-colors"
              title="Toggle Connection"
            >
              <Power 
                size={20} 
                className={isConnected ? "text-green-500" : "text-accent-primary"} 
              />
            </button>
          </div>
        </div>
        
        <div className="aspect-video w-full bg-black/50 relative">
          {isConnected ? (
            <iframe
              id="vnc-iframe"
              src="http://68.104.222.58:6080/vnc.html?host=68.104.222.58&port=5901&autoconnect=true&resize=scale"
              className="w-full h-full border-0"
              allow="fullscreen"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-primary/60">
              <Lock size={48} className="mb-4 text-accent-primary/40" />
              <p>Click the power button to connect</p>
            </div>
          )}
        </div>
        
        <div className="p-2 border-t border-accent-primary/20 flex justify-between items-center text-sm text-text-primary/60">
          <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
          <span>Press ESC to exit fullscreen</span>
        </div>
      </div>
    </div>
  );
};

export default VNCViewer;