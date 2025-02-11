import { Link, useLocation } from 'react-router-dom';
import { Home, Code, BookOpen, Twitch} from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-content">
                <div className="nav-links">
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        <Home size={20} />
                        <span>About</span>
                    </Link>

                    <Link 
                        to="/projects" 
                        className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
                    >
                        <Code size={20} />
                        <span>Projects</span>
                    </Link>

                    <Link 
                        to="/apcsp" 
                        className={`nav-link ${location.pathname === '/apcsp' ? 'active' : ''}`}
                    >
                        <BookOpen size={20} />
                        <span>APCSP</span>
                    </Link>

                    <a 
                        href="https://twitch.tv/EndofTimee"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                    >
                        <Twitch size={20} />
                        <span>Stream</span>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;