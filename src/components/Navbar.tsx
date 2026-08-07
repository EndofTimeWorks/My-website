import type { MouseEvent } from "react";
import { Home, Code, BookOpen, TvMinimalPlay } from "lucide-react";

interface NavbarProps {
    activePath: string;
    onNavigate: (path: "/" | "/projects") => void;
}

const Navbar = ({ activePath, onNavigate }: NavbarProps) => {
    const handleLocalLink =
        (path: "/" | "/projects") =>
        (event: MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            onNavigate(path);
        };

    return (
        <nav className="navbar">
            <div className="nav-content">
                <div className="nav-links">
                    <a
                        href="/"
                        onClick={handleLocalLink("/")}
                        className={`nav-link ${activePath === "/" ? "active" : ""}`}
                    >
                        <Home size={20} />
                        <span>About</span>
                    </a>

                    <a
                        href="/projects"
                        onClick={handleLocalLink("/projects")}
                        className={`nav-link ${activePath === "/projects" ? "active" : ""}`}
                    >
                        <Code size={20} />
                        <span>Projects</span>
                    </a>

                    <a
                        href="https://blog.endoftime.works"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                    >
                        <BookOpen size={20} />
                        <span>Blog</span>
                    </a>
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
