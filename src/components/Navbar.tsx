import { Link, useLocation } from "react-router-dom";
import { Home, Code, BookOpen, Twitch } from "lucide-react";

const Navbar = () => {
    const location = useLocation();
    const handleRedirect = () => {
        window.open("https://vnc.endoftimee.tech", "_blank");
    };

    return (
        <nav className="navbar">
            <div className="nav-content">
                <div className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                    >
                        <Home size={20} />
                        <span>About</span>
                    </Link>

                    <Link
                        to="/projects"
                        className={`nav-link ${location.pathname === "/projects" ? "active" : ""}`}
                    >
                        <Code size={20} />
                        <span>Projects</span>
                    </Link>
                    {/* 
                    <Link 
                        to="/apcsp" 
                        className={`nav-link ${location.pathname === '/apcsp' ? 'active' : ''}`}
                    >
                        <BookOpen size={20} />
                        <span>APCSP</span>
                    </Link> */}

                    <button
                        onClick={handleRedirect}
                        className="nav-link"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "0 15px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Code size={20} />
                        <span>NoVNC</span>
                    </button>

                    <a
                        href="https://twitch.tv/EndofTimee"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                    >
                        <Twitch size={20} />
                        <span>Stream</span>
                    </a>

                    <div className="nav-link">
                        <iframe
                            src="https://github.com/sponsors/System-End/button"
                            title="Sponsor End!"
                            height="32"
                            width="114"
                            style={{ border: 0, borderRadius: "6px" }}
                        ></iframe>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
