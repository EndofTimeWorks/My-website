import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Code,
    BookOpen,
    GraduationCap,
    TvMinimalPlay,
} from "lucide-react";

const Navbar = () => {
    const location = useLocation();

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

                    <a
                        href="https://blog.endoftime.works"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                    >
                        <BookOpen size={20} />
                        <span>Blog</span>
                    </a>
                    <Link
                        to="/apcsp"
                        className={`nav-link ${location.pathname === "/apcsp" ? "active" : ""}`}
                    >
                        <GraduationCap size={20} />
                        <span>APCSP</span>
                    </Link>

                    <a
                        href="https://vnc.endoftime.works"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                    >
                        <Code size={20} />
                        <span>NoVNC</span>
                    </a>

                    <a
                        href="https://twitch.tv/EndofTimeWorks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                    >
                        <TvMinimalPlay size={20} />
                        <span>Stream</span>
                    </a>

                    <div className="nav-link">
                        <iframe
                            src="https://github.com/sponsors/EndofTimeWorks/button"
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
