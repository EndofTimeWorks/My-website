
import React, { useEffect, useState } from 'react';
import '@/styles/.css';

const GithubRepos = () => {
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch('https://api.github.com/users/EndofTimee/repos');
                const data = await response.json();
                setRepos(data);
            } catch (error) {
                console.error('Error fetching GitHub repos:', error);
            }
        };

        fetchRepos();
    }, []);

    return (
        <div className="github-repos-container">
            <h1>My GitHub Repositories</h1>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GithubRepos;

