
import { Router } from 'itty-router';

const router = Router();

const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_SPOTIFY_CLIENT_SECRET';

let accessToken = null;
let tokenExpiry = null;

// Helper function to fetch a new access token
async function fetchAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Spotify token: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    console.log('New access token fetched');
}

// Middleware to ensure a valid access token
async function ensureAccessToken() {
    if (!accessToken || Date.now() >= tokenExpiry) {
        await fetchAccessToken();
    }
}

// Route to fetch Spotify data (Top Tracks)
router.get('/spotify-data', async () => {
    try {
        await ensureAccessToken();

        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch Spotify data' }), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify({
            topTracks: data.items.map(track => ({
                name: track.name,
                artist: track.artists.map(artist => artist.name).join(', ')
            }))
        }), { headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
});

// Default route for unmatched paths
router.all('*', () => new Response('Not Found', { status: 404 }));

// Event listener for handling requests
addEventListener('fetch', (event) => {
    event.respondWith(router.handle(event.request));
});
