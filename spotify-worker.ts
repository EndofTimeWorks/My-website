import { Router } from 'itty-router'

const router = Router()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

const errorResponse = (message: string, status = 500) => {
  return jsonResponse({ error: message }, status)
}

async function refreshAccessToken(env: any) {
  const authResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)
    },
    body: 'grant_type=client_credentials'
  })

  const data = await authResponse.json()
  return data.access_token
}

router.options('*', () => new Response(null, { headers: corsHeaders }))

router.get('/health', () => {
  return jsonResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

router.get('/top-tracks', async (request: any, env: any) => {
  try {
    const accessToken = await refreshAccessToken(env)
    
    const spotifyResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const spotifyData = await spotifyResponse.json()
    return jsonResponse(spotifyData)
  } catch (error: any) {
    return errorResponse('Failed to fetch Spotify data: ' + error.message)
  }
})

router.all('*', () => errorResponse('Not Found', 404))

export default {
  fetch: (request: Request, env: any, ctx: any) => router.handle(request, env, ctx)
}
