/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_GITHUB_USERNAME?: string;
    readonly VITE_LASTFM_API_KEY?: string;
    readonly VITE_LASTFM_USERNAME?: string;
    readonly VITE_USE_LOCAL_API?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
