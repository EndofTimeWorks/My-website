const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ?? "";

export const shouldUseLocalApi =
    import.meta.env.VITE_USE_LOCAL_API === "true" || apiBaseUrl.length > 0;

export const getApiUrl = (path: string) => {
    const normalisedPath = path.startsWith("/") ? path : `/${path}`;
    return `${apiBaseUrl}${normalisedPath}`;
};

export const getGithubUsername = () =>
    import.meta.env.VITE_GITHUB_USERNAME?.trim() || "System-End";
