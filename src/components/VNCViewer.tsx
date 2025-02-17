import React, { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';

const VNCViewer = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  // Matrix rain effect characters
  const chars = '01';
  const [drops, setDrops] = useState([]);
  
  useEffect(() => {
    // Initialize matrix rain
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const initialDrops = Array(Math.floor(columns)).fill(1);
    setDrops(initialDrops);
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <canvas id="matrix-bg" className="absolute inset-0 z-0" />
      
      <div className="w-full max-w-2xl bg-background-primary/80 backdrop-blur-sm rounded-xl shadow-xl border border-accent-primary/20 p-6 space-y-4 transition-all duration-300 hover:border-accent-neon/40 hover:shadow-accent-primary/20 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="text-accent-primary" size={24} />
          <h2 className="text-xl font-semibold text-text-primary">Raspberry Pi VNC Viewer</h2>
        </div>
        
        <div className="aspect-video w-full bg-black/50 rounded-lg overflow-hidden">
          {isConnected ? (
            <iframe 
              src="http://your-raspberry-pi-ip:6080/vnc.html?host=your-raspberry-pi-ip&port=5900"
              className="w-full h-full border-0"
              title="VNC Viewer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-primary/60">
              Not connected
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => setIsConnected(!isConnected)}
            className="px-4 py-2 bg-accent-primary/20 rounded-lg text-text-primary hover:bg-accent-primary/30 transition-colors"
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VNCViewer;