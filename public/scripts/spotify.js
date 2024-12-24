fetch('/spotify-data')
    .then(response => response.json())
    .then(data => {
        const spotifyList = document.getElementById('spotify-list');
        data.items.forEach(track => {
            const listItem = document.createElement('li');
            listItem.textContent = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
            spotifyList.appendChild(listItem);
        });
    });