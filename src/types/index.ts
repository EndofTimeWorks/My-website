// src/types/index.ts

import { ReactNode } from 'react';

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: {
        name: string;
    }[];
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

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export interface ErrorBoundaryProps {
    children: ReactNode;
}

export interface FoxCardProps {
    children: ReactNode;
    className?: string;
}

export interface SpotifyVisualizerProps {
    isPlaying?: boolean;
}

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
}
