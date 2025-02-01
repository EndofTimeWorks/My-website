import { Router } from 'itty-router';
import { jsonResponse, errorResponse } from '../utils/response';
import { getSpotifyToken } from '../utils/spotify';
import type { Env } from '../types';
import type { SpotifyTopTracksResponse } from '../types/spotify';

export const spotifyRouter = Router({ base: '/spotify' });

spotifyRouter.get('/top-tracks', async ({ env }: { env: Env }) => {
    try {
        const accessToken = await getSpotifyToken(env);
        
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tracks: ${response.status}`);
        }

        const data = await response.json() as SpotifyTopTracksResponse;
        return jsonResponse(data);
    } catch (error) {
        const err = error as Error;
        return errorResponse(err.message);
    }
});
