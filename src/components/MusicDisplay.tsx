import { useState, useEffect } from "react";
import { Music } from "lucide-react";
import { getApiUrl, shouldUseLocalApi } from "@/utils/api";

interface LastFMImage {
    "#text": string;
    size: string;
}

interface LastFMTrack {
    name: string;
    artist: {
        "#text": string;
    };
    image: LastFMImage[];
    "@attr"?: {
        nowplaying: string;
    };
}

interface LastFMResponse {
    recenttracks: {
        track: LastFMTrack[];
    };
}

interface CurrentTrack {
    name: string;
    artist: string;
    image: string;
    isPlaying: boolean;
}

const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

const getLastFmUrl = () => {
    const apiKey = import.meta.env.VITE_LASTFM_API_KEY;
    const username = import.meta.env.VITE_LASTFM_USERNAME;

    if (!apiKey || !username) {
        return null;
    }

    return `${LASTFM_API_URL}?${new URLSearchParams({
        method: "user.getrecenttracks",
        user: username,
        api_key: apiKey,
        format: "json",
        limit: "1",
    }).toString()}`;
};

const fetchLastFmTrack = async (signal: AbortSignal) => {
    const directUrl = getLastFmUrl();
    const url =
        shouldUseLocalApi || !directUrl
            ? getApiUrl("/api/lastfm/current-track")
            : directUrl;

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as LastFMResponse;
};

const MusicDisplay = () => {
    const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const fetchCurrentTrack = async () => {
            try {
                const data = await fetchLastFmTrack(controller.signal);

                if (!data.recenttracks?.track?.length) {
                    setCurrentTrack(null);
                    setExpanded(true);
                    return;
                }

                const track = data.recenttracks.track[0];

                const largeImage = track.image.find(
                    (img) => img.size === "large",
                );
                const imageUrl = largeImage
                    ? largeImage["#text"]
                    : track.image[track.image.length - 1]
                      ? track.image[track.image.length - 1]["#text"]
                      : "/placeholder-album.jpg";

                const isCurrentlyPlaying =
                    track["@attr"]?.nowplaying === "true";

                if (!isCurrentlyPlaying) {
                    setCurrentTrack(null);
                    setExpanded(true);
                    return;
                }

                setCurrentTrack({
                    name: track.name,
                    artist: track.artist["#text"],
                    image: imageUrl,
                    isPlaying: true,
                });
                setExpanded(false);
                setError(null);
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "An error occurred";
                setCurrentTrack(null);
                setExpanded(true);
                setError(errorMessage);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchCurrentTrack();
        const interval = setInterval(fetchCurrentTrack, 30000);

        return () => {
            controller.abort();
            clearInterval(interval);
        };
    }, []);

    if (loading) {
        return (
            <div className="h-[88px] flex items-center justify-center p-4 animate-pulse">
                <Music className="w-5 h-5 mr-2" />
                <span>Loading music...</span>
            </div>
        );
    }

    if (error || !currentTrack) {
        return (
            <div
                className={`overflow-hidden transition-[height] duration-500 ease-in-out ${expanded ? "h-[352px]" : "h-[88px]"}`}
            >
                {error && (
                    <div className="mb-3 flex items-center gap-2 rounded-lg border border-accent-primary/10 bg-background-secondary/60 px-3 py-2 text-xs text-text-primary/65">
                        <Music className="h-4 w-4" />
                        <span>Live track unavailable. Showing playlist instead.</span>
                    </div>
                )}
                <iframe
                    title="Spotify Playlist"
                    style={{ borderRadius: "12px" }}
                    src="https://open.spotify.com/embed/playlist/58ggvvTcs95yhcSeSxLGks?utm_source=generator"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                />
            </div>
        );
    }

    return (
        <div className="h-[88px] flex items-center gap-4 p-4 bg-gradient-card rounded-lg">
            <div className="relative w-16 h-16 flex-shrink-0">
                <img
                    src={currentTrack.image}
                    alt={`${currentTrack.name} album art`}
                    className="w-full h-full object-cover rounded-md shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3">
                    <span className="absolute w-full h-full bg-accent-neon rounded-full animate-ping"></span>
                    <span className="absolute w-full h-full bg-accent-neon rounded-full"></span>
                </div>
            </div>
            <div className="flex flex-col min-w-0">
                <span className="font-medium truncate">
                    {currentTrack.name}
                </span>
                <span className="text-sm opacity-75 truncate">
                    {currentTrack.artist}
                </span>
            </div>
        </div>
    );
};

export default MusicDisplay;
