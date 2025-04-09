import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import FoxCard from '@/components/FoxCard';
import { Lock, User, LogIn, AlertTriangle, Shield, Brain } from 'lucide-react';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // Get the intended destination, or default to home
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/';
  
  // Handle countdown timer for account lockout
  useEffect(() => {
    if (lockCountdown <= 0) return;
    
    const timer = setTimeout(() => {
      setLockCountdown(prevCount => prevCount - 1);
      if (lockCountdown === 1) {
        setIsLocked(false);
        setLoginAttempts(0);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [lockCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isLocked) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await auth.login(username, password);
      
      if (success) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        navigate(from, { replace: true });
      } else {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockCountdown(30); // 30 second lockout
          setError('Too many failed attempts. Account locked for 30 seconds.');
        } else {
          setError(`Invalid username or password. ${5 - newAttempts} attempts remaining.`);
        }
      }
    } catch (err) {
      setError('An error occurred during login. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <FoxCard className="header-card mb-8">
        <h1 className="text-glow">System Access</h1>
        <p className="text-gradient">Please authenticate to view system information</p>
      </FoxCard>

      <div className="flex justify-center">
        <FoxCard className="w-full max-w-md p-8 relative overflow-hidden">
          {/* Decorative fox ears in corners */}
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-br-xl bg-fox-pink opacity-20 transform rotate-45"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 rounded-bl-xl bg-fox-pink opacity-20 transform -rotate-45"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <Brain size={32} className="text-accent-primary" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-glow mb-6 text-center">System Authentication</h2>
            
            {error && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 flex items-start gap-2">
                <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {isLocked && (
              <div className="bg-orange-500/20 text-orange-300 p-3 rounded-md mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={18} />
                  <span className="font-medium">Access Temporarily Locked</span>
                </div>
                <p className="text-sm">
                  Please wait {lockCountdown} seconds before trying again.
                </p>
                <div className="w-full h-1.5 bg-background-primary rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-1000"
                    style={{ width: `${(lockCountdown / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  System Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User size={18} className="text-accent-primary/60" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 p-3 bg-background-secondary/50 border border-accent-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-neon/40 focus:border-accent-neon transition-colors"
                    placeholder="Enter username"
                    required
                    disabled={isLoading || isLocked}
                    autoComplete="username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-accent-primary/60" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 p-3 bg-background-secondary/50 border border-accent-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-neon/40 focus:border-accent-neon transition-colors"
                    placeholder="Enter access code"
                    required
                    disabled={isLoading || isLocked}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-accent-primary/60 hover:text-accent-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full p-3 flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-neon transition-colors rounded-md text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Access System</span>
                  </>
                )}
              </button>

              <div className="text-center text-sm mt-6">
                <div className="flex items-center justify-center gap-2 mb-2 text-accent-primary">
                  <Shield size={16} />
                  <span className="font-medium">Secure Access Only</span>
                </div>
                <p className="text-text-primary/60">
                  This area contains private system information.
                </p>
                <p className="mt-2 text-accent-primary/80">
                  {locationState?.from ? 'You must log in to access the requested page.' : 'Access credentials are required.'}
                </p>
                
                <div className="mt-4 p-2 border border-accent-primary/10 rounded-md bg-background-secondary/20">
                  <p className="text-xs text-text-primary/70">
                    Available users: "system", "aurora", or "endoftimee"
                  </p>
                </div>
              </div>
            </form>
          </div>
        </FoxCard>
      </div>
    </div>
  );
};

export default LoginPage;
