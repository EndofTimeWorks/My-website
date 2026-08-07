import { useState, useEffect } from "react";
import type { GithubRepo } from "@/types";
import { getApiUrl, getGithubUsername, shouldUseLocalApi } from "@/utils/api";

type GithubApiRepo = Omit<GithubRepo, "languages">;

const fetchLanguages = async (
    languagesUrl: string,
    signal: AbortSignal,
): Promise<string[]> => {
    const response = await fetch(languagesUrl, {
        headers: {
            Accept: "application/vnd.github+json",
        },
        signal,
    });

    if (!response.ok) {
        return [];
    }

    const languages = (await response.json()) as Record<string, number>;
    return Object.keys(languages);
};

const fetchReposFromGithub = async (signal: AbortSignal) => {
    const username = encodeURIComponent(getGithubUsername());
    const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`,
        {
            headers: {
                Accept: "application/vnd.github+json",
            },
            signal,
        },
    );

    if (!response.ok) {
        throw new Error("Failed to fetch repositories");
    }

    const repos = (await response.json()) as GithubApiRepo[];
    return Promise.all(
        repos.map(async (repo) => ({
            ...repo,
            languages: await fetchLanguages(repo.languages_url, signal),
        })),
    );
};

const fetchReposFromApi = async (signal: AbortSignal) => {
    const response = await fetch(getApiUrl("/api/github-repos"), { signal });

    if (!response.ok) {
        throw new Error("Failed to fetch repositories");
    }

    return (await response.json()) as GithubRepo[];
};

const useGithubRepos = () => {
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestKey, setRequestKey] = useState(0);

    const refetch = () => {
        setRequestKey((current) => current + 1);
    };

    useEffect(() => {
        const controller = new AbortController();

        const fetchRepos = async () => {
            try {
                setLoading(true);
                setError(null);

                const reposData = shouldUseLocalApi
                    ? await fetchReposFromApi(controller.signal)
                    : await fetchReposFromGithub(controller.signal);

                setRepos(reposData);
            } catch (err) {
                if (controller.signal.aborted) {
                    return;
                }

                const error = err as Error;
                setError(error.message);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchRepos();
        return () => controller.abort();
    }, [requestKey]);

    return { repos, loading, error, refetch };
};

export default useGithubRepos;
