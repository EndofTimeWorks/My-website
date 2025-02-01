// src/worker/types/index.ts
export interface Env {
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_SECRET: string;
    SPOTIFY_REDIRECT_URI: string;
    ENVIRONMENT: 'development' | 'production';
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
}
