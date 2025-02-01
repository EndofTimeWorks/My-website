import React from 'react';
import FoxCard from '../components/FoxCard';
import GithubRepos from '../components/GithubRepos';
import useGithubRepos from '../hooks/useGithubRepos';
import LoadingFox from '../components/LoadingFox';

const ProjectsPage = () => {
    const { repos, loading, error } = useGithubRepos();

    return (
        <div className="page-container">
            <FoxCard className="header-card">
                <h1 className="text-glow">My Projects</h1>
                <p className="text-gradient">Exploring code, one repo at a time</p>
            </FoxCard>

            {loading ? (
                <LoadingFox />
            ) : error ? (
                <FoxCard className="error-card">
                    <p>Oops! Something went wrong fetching the repositories.</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Try Again
                    </button>
                </FoxCard>
            ) : (
                <GithubRepos repos={repos} />
            )}
        </div>
    );
};

export default ProjectsPage;

