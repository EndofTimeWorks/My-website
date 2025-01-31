import { Router } from 'itty-router';

const router = Router();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Response helper
const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

// Error response helper
const errorResponse = (message, status = 500) => {
  return jsonResponse({ error: message }, status);
};

// Spotify credentials
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Function to refresh Spotify Access Token
async function refreshAccessToken() {
  const authResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await authResponse.json();
  return data.access_token;
}

// CORS preflight handler
router.options('*', () => new Response(null, { headers: corsHeaders }));

// Health check endpoint
router.get('/health', () => {
  return jsonResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Spotify top tracks endpoint
router.get('/top-tracks', async () => {
  try {
    const accessToken = await refreshAccessToken();
    
    const spotifyResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const spotifyData = await spotifyResponse.json();
    return jsonResponse(spotifyData);
  } catch (error) {
    return errorResponse('Failed to fetch Spotify data: ' + error.message);
  }
});

// 404 handler
router.all('*', () => errorResponse('Not Found', 404));

// Export handler
export default {
  fetch: (request, env, ctx) => router.handle(request, env, ctx)
};