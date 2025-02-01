import { useState, useEffect } from 'react';

const useGithubRepos = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch('https://api.github.com/users/EndofTimee/repos?sort=updated');
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }
                const data = await response.json();
                
                // Get additional details for each repo
                const repoDetails = await Promise.all(
                    data.map(async (repo) => {
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
            } catch (err) {
                setError(err.message);
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

