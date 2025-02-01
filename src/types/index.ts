// src/types/index.ts

export interface GithubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    languages: string[];
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{
        name: string;
    }>;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export interface ErrorBoundaryProps {
    children: React.ReactNode;
}

export interface FoxCardProps {
    children: React.ReactNode;
    className?: string;
}
