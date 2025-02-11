const SpotifyEmbed = () => {
    return (
      <div className="w-full aspect-[100/35]">
        <iframe 
          src="https://open.spotify.com/embed/playlist/58ggvvTcs95yhcSeSxLGks?utm_source=generator" 
          width="100%" 
          height="100%" 
          style={{ borderRadius: '12px' }}
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        />
      </div>
    );
  };
  
  export default SpotifyEmbed;