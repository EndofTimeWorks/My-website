import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WORKER_URL = 'https://spotify-worker.your-worker-subdomain.workers.dev';

function SpotifyList() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${WORKER_URL}/top-tracks`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }

        const data = await response.json();
        setTracks(data.items || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200">
        <CardContent className="p-6">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>My Top Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tracks.map((track, index) => (
            <li 
              key={track.id} 
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="font-medium">{index + 1}.</span>{' '}
              {track.name} by{' '}
              <span className="text-gray-600">
                {track.artists.map(artist => artist.name).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default SpotifyList;
