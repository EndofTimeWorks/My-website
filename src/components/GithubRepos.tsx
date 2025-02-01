import { GithubRepo } from '@/types';
import '@/styles/GithubRepos.css';

interface GithubReposProps {
    repos: GithubRepo[];
}

const GithubRepos: React.FC<GithubReposProps> = ({ repos }) => {
    return (
        <div className="github-repos-container">
            <div className="repos-grid">
                {repos.map((repo) => (
                    <div key={repo.id} className="repo-card">
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-name">
                            {repo.name}
                        </a>
                        <p className="repo-description">
                            {repo.description || 'No description provided.'}
                        </p>
                        {repo.language && (
                            <span className="repo-language">{repo.language}</span>
                        )}
                        {repo.languages && repo.languages.length > 0 && (
                            <div className="repo-languages">
                                {repo.languages.map((lang) => (
                                    <span key={lang} className="language-tag">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GithubRepos;
