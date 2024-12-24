require('dotenv').config();
const express = require('express');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 3000;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

let access_token = '';
let refresh_token = '';

app.use(express.static('public'));

app.get('/login', (req, res) => {
    const scope = 'user-top-read';
    const authUrl = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri
        });
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const fetch = (await import('node-fetch')).default;
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        })
    });
    const tokenData = await tokenResponse.json();
    access_token = tokenData.access_token;
    refresh_token = tokenData.refresh_token;

    res.redirect('/');
});

async function refreshAccessToken() {
    const fetch = (await import('node-fetch')).default;
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        })
    });
    const tokenData = await tokenResponse.json();
    access_token = tokenData.access_token;
}

app.get('/spotify-data', async (req, res) => {
    if (!access_token) {
        await refreshAccessToken();
    }
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });
    const data = await response.json();
    res.json(data);
});

app.get('/github-repos', async (req, res) => {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`);
    const data = await response.json();
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
app.get('/spotify-data', async (req, res) => {
    if (!access_token) {
        return res.status(401).json({ error: 'User not authenticated. Please login first.' });
    }
    try {
        const fetch = (await import('node-fetch')).default;

        // Fetch user's top tracks
        const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const topTracks = await tracksResponse.json();

        // Fetch user's playlists
        const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=5', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const playlists = await playlistsResponse.json();

        res.json({
            topTracks: topTracks.items.map(track => ({
                name: track.name,
                artist: track.artists.map(artist => artist.name).join(', ')
            })),
            playlists: playlists.items.map(playlist => ({
                name: playlist.name,
                url: playlist.external_urls.spotify
            }))
        });
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        res.status(500).json({ error: 'Failed to fetch Spotify data' });
    }
});
