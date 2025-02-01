import { useState, useEffect } from 'react';
import { GithubRepo } from '@/types';

const useGithubRepos = () => {
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch('https://api.github.com/users/EndofTimee/repos?sort=updated');
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }
                const data = await response.json();
                
                const repoDetails = await Promise.all(
                    data.map(async (repo: GithubRepo) => {
                        try {
                            const languagesResponse = await fetch(repo.languages_url);
                            const languages = await languagesResponse.json();
                            return {
                                ...repo,
                                languages: Object.keys(languages)
                            };
                        } catch (error) {
                            console.error(`Error fetching languages for ${repo.name}:`, error);
                            return {
                                ...repo,
                                languages: []
                            };
                        }
                    })
                );
                
                setRepos(repoDetails);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching repos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    return { repos, loading, error };
};

export default useGithubRepos;
