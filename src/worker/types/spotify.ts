// src/worker/types/spotify.ts
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

export interface SpotifyArtist {
    name: string;
    id: string;
    uri: string;
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: {
        name: string;
        images: Array<{
            url: string;
            height: number;
            width: number;
        }>;
    };
    duration_ms: number;
    uri: string;
}

export interface SpotifyTopTracksResponse {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
}
