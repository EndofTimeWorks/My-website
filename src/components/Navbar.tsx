import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Home, Code, BookOpen, Twitch } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-content">
                <Link to="/" className="nav-brand">
                    <img src="/logo.jpg" alt="Logo" className="nav-logo" />
                    <span className="text-glow">EndofTimee</span>
                </Link>

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

                <ThemeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
