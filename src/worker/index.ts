import { AutoRouter, error, json } from "itty-router";

interface Env {
    GITHUB_USERNAME?: string;
    LASTFM_API_KEY?: string;
    LASTFM_USERNAME?: string;
}

const router = AutoRouter({
    finally: [json],
    catch: error,
});

const withCors = (response: Response) => {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS",
    );
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
};

router.options("/api/*", () => new Response(null, { status: 204 }));

router.get("/api/health", () => ({
    ok: true,
}));

router.get("/api/github-repos", async (_request, env: Env) => {
    const username = env.GITHUB_USERNAME ?? "System-End";
    const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "personal-site",
            },
        },
    );

    if (!reposResponse.ok) {
        return new Response(
            JSON.stringify({ error: "Failed to fetch repositories" }),
            { status: reposResponse.status },
        );
    }

    const repos = (await reposResponse.json()) as Array<{
        id: number;
        name: string;
        html_url: string;
        description: string | null;
        language: string | null;
        languages_url: string;
    }>;

    const repoDetails = await Promise.all(
        repos.map(async (repo) => {
            try {
                const languagesResponse = await fetch(repo.languages_url, {
                    headers: {
                        Accept: "application/vnd.github+json",
                        "User-Agent": "personal-site",
                    },
                });

                if (!languagesResponse.ok) {
                    throw new Error("Failed to fetch languages");
                }

                const languages =
                    (await languagesResponse.json()) as Record<string, number>;

                return {
                    ...repo,
                    languages: Object.keys(languages),
                };
            } catch {
                return {
                    ...repo,
                    languages: [],
                };
            }
        }),
    );

    return repoDetails;
});

router.get("/api/lastfm/current-track", async (_request, env: Env) => {
    if (!env.LASTFM_API_KEY || !env.LASTFM_USERNAME) {
        return new Response(
            JSON.stringify({ error: "Last.fm credentials are not configured" }),
            { status: 503 },
        );
    }

    const url =
        "https://ws.audioscrobbler.com/2.0/?" +
        new URLSearchParams({
            method: "user.getrecenttracks",
            user: env.LASTFM_USERNAME,
            api_key: env.LASTFM_API_KEY,
            format: "json",
            limit: "1",
        }).toString();

    const response = await fetch(url);

    if (!response.ok) {
        return new Response(
            JSON.stringify({ error: "Failed to fetch Last.fm data" }),
            { status: response.status },
        );
    }

    const data = await response.json();
    return data;
});

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const response = await router.fetch(request, env, ctx);
        return withCors(response);
    },
};
