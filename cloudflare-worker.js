
import { Router } from 'itty-router';

const router = Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = proccess.env.CLIENT_SECRET;
const REDIRECT_URI = proces.env.REDIRECT_URI
let accessToken = null;

// Function to refresh Spotify Access Token
async function refreshAccessToken() {
    const authResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await authResponse.json();
    accessToken = data.access_token;
}

// Spotify Data Fetch Endpoint
router.get('/spotify-data', async (request) => {
    if (!accessToken) {
        await refreshAccessToken();
    }

    const spotifyResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const spotifyData = await spotifyResponse.json();
    return new Response(JSON.stringify(spotifyData), {
        headers: { 'Content-Type': 'application/json' }
    });
});

// Default Route
router.all('*', () => new Response('Not Found', { status: 404 }));

// Event Listener for Worker Requests
addEventListener('fetch', (event) => {
    event.respondWith(router.handle(event.request));
});
