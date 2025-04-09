import { useEffect, useState } from 'react';

const ParallaxPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-[200vh] overflow-hidden">
      {/* Background Layer */}
      <div 
        className="fixed inset-0 bg-background-primary"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background-primary to-background-secondary opacity-50" />
      </div>

      {/* Stars Layer */}
      <div 
        className="fixed inset-0"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative">
        {/* Hero Section */}
        <div className="h-screen flex flex-col items-center justify-center text-center px-4 sticky top-0">
          <h1 
            className="text-6xl md:text-8xl font-bold text-glow mb-6"
            style={{
              transform: `translateY(${scrollY * -0.5}px)`,
              opacity: 1 - (scrollY * 0.002),
            }}
          >
            Parallax Magic
          </h1>
          <p 
            className="text-xl md:text-2xl text-text-primary/80 max-w-2xl"
            style={{
              transform: `translateY(${scrollY * -0.3}px)`,
              opacity: 1 - (scrollY * 0.002),
            }}
          >
            Scroll down to experience the parallax effect
          </p>
        </div>

        {/* Content Sections */}
        <div className="relative bg-background-primary/50 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-4 py-24">
            <div className="space-y-24">
              {/* About Section */}
              <section 
                className="space-y-6 p-8 bg-gradient-card rounded-lg"
                style={{
                  transform: `translateX(${(scrollY - 500) * 0.2}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - 500) * 0.002)),
                }}
              >
                <h2 className="text-3xl font-bold text-glow">About Parallax</h2>
                <p className="text-lg text-text-primary/80">
                  Parallax scrolling is a web design technique where background images move slower
                  than foreground images, creating an illusion of depth and immersion.
                </p>
              </section>

              {/* How It Works Section */}
              <section 
                className="space-y-6 p-8 bg-gradient-card rounded-lg"
                style={{
                  transform: `translateX(${(scrollY - 800) * -0.2}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - 800) * 0.002)),
                }}
              >
                <h2 className="text-3xl font-bold text-glow">How It Works</h2>
                <p className="text-lg text-text-primary/80">
                  As you scroll, different elements move at different speeds. This creates a
                  dynamic, layered effect that adds depth to the page. The background moves slower
                  than the foreground elements, while text and content sections slide in from
                  the sides.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxPage;