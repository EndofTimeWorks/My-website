import { useState, useEffect } from "react";
import type { GithubRepo } from "@/types";

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

                const response = await fetch("/api/github-repos", {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch repositories");
                }

                const reposData = (await response.json()) as GithubRepo[];
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
