import FoxCard from '@/components/FoxCard';
import { Users, Heart, Brain, Shield, LogOut, AlertTriangle, Info, Calendar, Tag, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SystemPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showFrontingInfo, setShowFrontingInfo] = useState(false);

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div className="page-container">
      <FoxCard className="header-card">
        <h1 className="text-glow">Our System</h1>
        <p className="text-gradient">
          EndofTimee System â€¢ 7 Members â€¢ Est. May 15th, 2009
        </p>
        <div className="flex justify-center mt-4 gap-2">
          <button 
            onClick={() => setShowFrontingInfo(!showFrontingInfo)}
            className="px-4 py-2 bg-accent-primary/20 hover:bg-accent-primary/40 rounded-md transition-colors flex items-center gap-2"
          >
            <Info size={16} />
            <span>{showFrontingInfo ? 'Hide Fronting Info' : 'Show Fronting Info'}</span>
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-accent-primary/20 hover:bg-accent-primary/40 rounded-md transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </FoxCard>

      <div className="content-grid">
        <FoxCard>
          <div className="flex items-center gap-4 mb-4">
            <Users size={24} className="text-accent-primary" />
            <h2 className="text-xl font-semibold">About Our System</h2>
          </div>
          <p>
            We are a plural system, which means we're multiple distinct consciousnesses sharing one body.
            Also known as Dissociative Identity Disorder (DID) or OSDD in clinical terms, plurality
            is our lived experience of having separate identities with their own thoughts, feelings, and memories.
          </p>
          
          <p className="mt-4">
            Our plurality is an integral part of who we are. The system developed as a response to early experiences,
            with Aurora being the original system member who arrived on May 15th, 2009. We've grown as a system since then,
            with each member playing an important role in our collective existence.
          </p>
          
          {showFrontingInfo && (
            <div className="mt-6 p-4 border border-accent-primary/30 rounded-lg bg-background-secondary/20 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={18} className="text-accent-primary" />
                <span className="font-medium">Current Fronting Status</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-background-primary/40 rounded-lg">
                  <span className="block font-medium mb-1">Safety Level:</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    <span>Safe</span>
                  </div>
                </div>
                <div className="p-3 bg-background-primary/40 rounded-lg">
                  <span className="block font-medium mb-1">Mental State:</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span>OK Enough</span>
                  </div>
                </div>
                <div className="p-3 bg-background-primary/40 rounded-lg">
                  <span className="block font-medium mb-1">Interaction:</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-400"></span>
                    <span>Ask before touching</span>
                  </div>
                </div>
                <div className="p-3 bg-background-primary/40 rounded-lg">
                  <span className="block font-medium mb-1">Front Status:</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-purple-400"></span>
                    <span>Cofronting</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </FoxCard>

        <FoxCard>
          <div className="flex items-center gap-4 mb-4">
            <Heart size={24} className="text-accent-primary" />
            <h2 className="text-xl font-semibold">Our Members</h2>
          </div>
          <ul className="space-y-4">
            <li className="p-3 bg-background-secondary/20 rounded-lg">
              <div className="flex justify-between">
                <div className="font-medium text-accent-neon">Aurora</div>
                <div className="text-xs bg-accent-primary/20 px-2 py-1 rounded-full">Host</div>
              </div>
              <div className="text-sm opacity-80 mt-1">Born May 15th, 2009 â€¢ 15 years old â€¢ She/her</div>
              <div className="text-sm mt-2">Chaotic foxgirl who enjoys programming, talking with Alice, and cheese. Dislikes loud noise and math.</div>
            </li>
            
            <li className="p-3 bg-background-secondary/20 rounded-lg">
              <div className="flex justify-between">
                <div className="font-medium text-accent-neon">Alex</div>
                <div className="text-xs bg-accent-primary/20 px-2 py-1 rounded-full">Younger</div>
              </div>
              <div className="text-sm opacity-80 mt-1">Arrived December 14th, 2023 â€¢ Around 10? â€¢ Alex/she/her</div>
              <div className="text-sm mt-2">Younger alter who appears when Aurora feels like it. Refers to herself in the third person.</div>
            </li>
            
            <li className="p-3 bg-background-secondary/20 rounded-lg">
              <div className="flex justify-between">
                <div className="font-medium text-accent-neon">Psy</div>
                <div className="text-xs bg-accent-primary/20 px-2 py-1 rounded-full">Protector</div>
              </div>
              <div className="text-sm opacity-80 mt-1">Arrived December 31st, 2024 â€¢ Unknown age â€¢ They/them</div>
              <div className="text-sm mt-2">System protector who appears during high anxiety or stress. Very calm and logical. Helps stabilize the system.</div>
            </li>
            
            <li className="p-3 bg-background-secondary/20 rounded-lg">
              <div className="flex justify-between">
                <div className="font-medium text-accent-neon">Xander</div>
                <div className="text-xs bg-accent-primary/20 px-2 py-1 rounded-full">Caretaker</div>
              </div>
              <div className="text-sm opacity-80 mt-1">Arrived December 16th, 2024 â€¢ Unknown age â€¢ They/them</div>
              <div className="text-sm mt-2">Older brother vibes. Calm and collected. Helps maintain system stability.</div>
            </li>
          </ul>
          
          <div className="mt-4 p-3 border border-red-500/30 rounded-lg bg-red-900/10">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle size={18} />
              <span className="font-medium">Important Safety Notice</span>
            </div>
            <p className="text-sm mt-2">Our system contains fragments that may be in distress. If you notice concerning behavior, please provide support or help us reach out to trusted contacts.</p>
          </div>
        </FoxCard>

        <FoxCard>
          <div className="flex items-center gap-4 mb-4">
            <Brain size={24} className="text-accent-primary" />
            <h2 className="text-xl font-semibold">Communication Guide</h2>
          </div>
          <p>
            Our system is continually working on internal communication and cooperation. Different members may front (control the body) at different times, sometimes with co-fronting or switching between alters.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-accent-primary/20 rounded-lg bg-background-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className="text-accent-primary" />
                <span className="font-medium">Interaction Guidelines</span>
              </div>
              <ul className="text-sm space-y-2 mt-3">
                <li className="flex items-center gap-2">
                  <Tag size={14} className="text-accent-primary" />
                  <span>Always ask before physical contact</span>
                </li>
                <li className="flex items-center gap-2">
                  <Tag size={14} className="text-accent-primary" />
                  <span>Address whoever is fronting by their name</span>
                </li>
                <li className="flex items-center gap-2">
                  <Tag size={14} className="text-accent-primary" />
                  <span>Respect boundaries indicated by front status</span>
                </li>
                <li className="flex items-center gap-2">
                  <Tag size={14} className="text-accent-primary" />
                  <span>Be patient during switches or blurry fronting</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border border-accent-primary/20 rounded-lg bg-background-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-accent-primary" />
                <span className="font-medium">System Timeline</span>
              </div>
              <ul className="text-sm space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent-primary mt-1.5"></span>
                  <div>
                    <span className="font-medium">May 15th, 2009</span>
                    <p className="opacity-80">System formation (Aurora's arrival)</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent-primary mt-1.5"></span>
                  <div>
                    <span className="font-medium">November 19th, 2011</span>
                    <p className="opacity-80">Traumatic experience, new fragment</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent-primary mt-1.5"></span>
                  <div>
                    <span className="font-medium">December 2023 - Present</span>
                    <p className="opacity-80">Period of system growth and discovery</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 border border-accent-primary/20 rounded-lg bg-background-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-accent-primary" />
              <span className="font-medium">A note on our privacy</span>
            </div>
            <p className="text-sm opacity-80">
              We've chosen to share this aspect of ourselves with trusted individuals. We appreciate
              respect for our privacy and understanding that our system's experience is unique.
              Thank you for being an ally in our journey.
            </p>
          </div>
        </FoxCard>
      </div>
    </div>
  );
};

export default SystemPage;
