import { useState, useEffect } from 'react';
import type { SpotifyTrack } from '@/types';

interface SpotifyData {
    data: SpotifyTrack[] | null;
    loading: boolean;
    error: string | null;
}

const useSpotifyData = (): SpotifyData => {
    const [data, setData] = useState<SpotifyTrack[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const workerUrl = import.meta.env.VITE_WORKER_URL;
                if (!workerUrl) throw new Error('Worker URL not configured');

                const response = await fetch(`${workerUrl}/spotify-data`);
                if (!response.ok) throw new Error('Failed to fetch Spotify data');
                
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useSpotifyData;
