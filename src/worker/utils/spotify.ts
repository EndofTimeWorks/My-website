// src/worker/utils/spotify.ts
import type { Env } from '../types';
import type { SpotifyTokenResponse, SpotifyError } from '../types/spotify';
import { errorResponse } from './response';

export async function getSpotifyToken(env: Env): Promise<string> {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error(`Failed to get token: ${response.status}`);
        }

        const data = await response.json<SpotifyTokenResponse | SpotifyError>();

        if ('error' in data) {
            throw new Error(data.error.message);
        }

        return data.access_token;
    } catch (error) {
        throw new Error(`Failed to get Spotify token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
