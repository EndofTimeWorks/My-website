import React, { useEffect, useState } from 'react';

function SpotifyList() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetch('/spotify-data')
      .then(response => response.json())
      .then(data => {
        setTracks(data.items);
      });
  }, []);

  return (
    <div id="spotify-list">
      <h2>My Most Listened to Songs</h2>
      <ul>
        {tracks.map(track => (
          <li key={track.id}>{track.name} by {track.artists.map(artist => artist.name).join(', ')}</li>
        ))}
      </ul>
    </div>
  );
}

export default SpotifyList;