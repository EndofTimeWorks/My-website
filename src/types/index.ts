import { ReactNode } from 'react';

export interface Track {
    id: string;
    name: string;
    artists: Array<{
        name: string;
    }>;
}

export interface GithubRepo {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    languages_url: string;
    languages: string[];
}

export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface SpotifyError {
    error: {
        status: number;
        message: string;
    };
}

export interface CardProps {
    className?: string;
    children: ReactNode;
}

export interface FoxCardProps {
    className?: string;
    children: ReactNode;
}

export interface ErrorBoundaryProps {
    children: ReactNode;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export interface SpotifyVisualizerProps {
    isPlaying?: boolean;
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
}

export interface GithubReposProps {
    repos: GithubRepo[];
}
